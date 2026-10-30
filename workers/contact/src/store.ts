import type { Inquiry } from './schema'

/** Runs one parameterised statement. The Neon driver in the Worker, `pg` in tests. */
export type Query = (text: string, params: unknown[]) => Promise<Record<string, unknown>[]>

// Writes straight to the table Payload's migrations create; status and _seed use their defaults.
export const INSERT_INQUIRY = `INSERT INTO inquiries (profile, name, email, project_type, message, timeline)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id`

export async function insertInquiry(query: Query, inquiry: Inquiry): Promise<number> {
  const rows = await query(INSERT_INQUIRY, [
    inquiry.profile,
    inquiry.name,
    inquiry.email,
    inquiry.projectType ?? null,
    inquiry.message,
    inquiry.timeline ?? null,
  ])
  const id = rows[0]?.id
  if (typeof id !== 'number') throw new Error('Insert returned no id')
  return id
}
