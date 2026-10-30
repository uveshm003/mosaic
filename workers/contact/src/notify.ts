import type { WorkerEnv } from './env'
import type { Inquiry } from './schema'

const replacements: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

// Resend inserts template variables as raw HTML, so visitor input is escaped here.
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => replacements[char] ?? char)
}

export async function sendNotification(
  options: { env: WorkerEnv; inquiry: Inquiry; inquiryId: number },
  fetcher: typeof fetch = fetch,
): Promise<void> {
  const { env, inquiry, inquiryId } = options
  const variables: Record<string, string> = {
    PROFILE: inquiry.profile,
    SENDER_NAME: inquiry.name,
    SENDER_EMAIL: inquiry.email,
    MESSAGE: inquiry.message,
  }
  // Left out when empty, so the template's "—" fallback applies.
  if (inquiry.projectType) variables.PROJECT_TYPE = inquiry.projectType
  if (inquiry.timeline) variables.TIMELINE = inquiry.timeline

  const response = await fetcher('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `inquiry-${String(inquiryId)}`,
    },
    body: JSON.stringify({
      from: env.RESEND_FROM,
      to: [env.NOTIFY_EMAIL],
      reply_to: inquiry.email,
      template: {
        id: env.RESEND_TEMPLATE,
        variables: Object.fromEntries(
          Object.entries(variables).map(([key, value]) => [key, escapeHtml(value)]),
        ),
      },
    }),
  })
  if (!response.ok) {
    throw new Error(`Resend returned HTTP ${String(response.status)}: ${await response.text()}`)
  }
}
