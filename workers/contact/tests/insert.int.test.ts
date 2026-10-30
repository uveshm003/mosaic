import pg from 'pg'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { insertInquiry, type Query } from '../src/store'

// A database built only by Payload's migrations (CI's "Migrations build an empty database"
// step), so schema drift between the admin and the Worker fails here.
const url = process.env.MIGRATED_DATABASE_URL
if (!url) throw new Error('Set MIGRATED_DATABASE_URL to a database migrated by apps/cms.')

const client = new pg.Client({ connectionString: url })
const query: Query = async (text, params) =>
  (await client.query<Record<string, unknown>>(text, params)).rows

beforeAll(async () => {
  await client.connect()
})

afterAll(async () => {
  await client.query(`DELETE FROM inquiries WHERE email LIKE '%@worker-test.example'`)
  await client.end()
})

describe('insertInquiry against the migrated schema', () => {
  it('stores a row the admin can triage', async () => {
    const id = await insertInquiry(query, {
      profile: 'freelance',
      name: 'Worker Test',
      email: 'full@worker-test.example',
      message: 'Hello from the integration test',
      projectType: 'Mobile app',
      timeline: '3 months',
    })
    const { rows } = await client.query<Record<string, unknown>>(
      'SELECT * FROM inquiries WHERE id = $1',
      [id],
    )
    expect(rows[0]).toMatchObject({
      profile: 'freelance',
      name: 'Worker Test',
      project_type: 'Mobile app',
      timeline: '3 months',
      status: 'new',
      _seed: false,
    })
    expect(rows[0]?.created_at).toBeInstanceOf(Date)
  })

  it('stores missing optional fields as null', async () => {
    const id = await insertInquiry(query, {
      profile: 'root',
      name: 'Worker Test',
      email: 'minimal@worker-test.example',
      message: 'Minimal',
      projectType: undefined,
      timeline: undefined,
    })
    const { rows } = await client.query(
      'SELECT project_type, timeline FROM inquiries WHERE id = $1',
      [id],
    )
    expect(rows[0]).toEqual({ project_type: null, timeline: null })
  })
})
