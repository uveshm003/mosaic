'use client'

import { useContactForm } from '../contact/useContactForm'

const timelines = ['As soon as possible', 'In the next month', 'In 1–3 months', 'Just exploring']

// The Freelance enquiry: who, what kind of project, when, and a message. Themed by the
// profile's tokens.
export function FreelanceForm({
  endpoint,
  siteKey,
  projectTypes,
  rounded = 'rounded-2xl',
}: {
  endpoint: string
  siteKey: string
  projectTypes: string[]
  rounded?: string
}) {
  const { status, submit, loadTurnstile, widget } = useContactForm({
    endpoint,
    siteKey,
    profile: 'freelance',
  })

  if (status.kind === 'sent') {
    return (
      <p role="status" className={`${rounded} border border-line bg-surface p-6 text-lg`}>
        Thanks! I’ll read it properly and reply by email, usually within two working days.
      </p>
    )
  }

  const field = `w-full ${rounded} border border-line bg-surface px-4 py-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30`
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void submit(event.currentTarget)
      }}
      onFocus={loadTurnstile}
      className="grid gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium">
          Your name
          <input
            name="name"
            required
            maxLength={100}
            autoComplete="name"
            className={`${field} mt-1.5`}
          />
        </label>
        <label className="text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            className={`${field} mt-1.5`}
          />
        </label>
        <label className="text-sm font-medium">
          What do you need?
          <select name="projectType" defaultValue="" className={`${field} mt-1.5`}>
            <option value="">Not sure yet</option>
            {projectTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          When?
          <select name="timeline" defaultValue="" className={`${field} mt-1.5`}>
            <option value="">No fixed date</option>
            {timelines.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="text-sm font-medium">
        Tell me about it
        <textarea
          name="message"
          required
          maxLength={2000}
          rows={5}
          placeholder="What are you building, who is it for, and what does done look like?"
          className={`${field} mt-1.5 resize-y`}
        />
      </label>
      {/* Honeypot: hidden from people and screen readers. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div ref={widget} className="min-h-[65px]" />
      {status.kind === 'error' && (
        <p role="alert" className="text-sm text-accent-2">
          {status.message}
        </p>
      )}
      <button
        type="submit"
        disabled={status.kind === 'sending'}
        className={`justify-self-start ${rounded} bg-accent px-6 py-3 font-semibold text-accent-fg transition hover:brightness-105 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
      >
        {status.kind === 'sending' ? 'Sending…' : 'Start the conversation'}
      </button>
    </form>
  )
}
