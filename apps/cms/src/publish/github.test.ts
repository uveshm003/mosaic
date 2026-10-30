import { describe, expect, it, vi } from 'vitest'
import { dispatchDeploy, latestDeployRun } from './github'

const run = {
  id: 7,
  status: 'completed',
  conclusion: 'success',
  html_url: 'https://github.com/uveshm003/mosaic/actions/runs/7',
  created_at: '2026-10-30T17:30:00Z',
  event: 'workflow_dispatch',
}

function target(response: Response) {
  const fetch = vi.fn<typeof globalThis.fetch>().mockResolvedValue(response)
  return { fetch, target: { token: 'token-123', repo: 'uveshm003/mosaic', fetch } }
}

describe('dispatchDeploy', () => {
  it('dispatches deploy.yml on main with the token', async () => {
    const { fetch, target: t } = target(new Response(null, { status: 204 }))
    await dispatchDeploy(t)
    const [url, init] = fetch.mock.calls[0] ?? []
    expect(url).toBe(
      'https://api.github.com/repos/uveshm003/mosaic/actions/workflows/deploy.yml/dispatches',
    )
    expect(init?.method).toBe('POST')
    expect(init?.body).toBe(JSON.stringify({ ref: 'main' }))
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer token-123')
  })

  it('throws when GitHub refuses', async () => {
    const { target: t } = target(new Response('{}', { status: 403 }))
    await expect(dispatchDeploy(t)).rejects.toThrow(/HTTP 403/)
  })
})

describe('latestDeployRun', () => {
  it('returns the newest run', async () => {
    const { target: t } = target(Response.json({ total_count: 1, workflow_runs: [run] }))
    await expect(latestDeployRun(t)).resolves.toEqual(run)
  })

  it('returns null before the first run', async () => {
    const { target: t } = target(Response.json({ total_count: 0, workflow_runs: [] }))
    await expect(latestDeployRun(t)).resolves.toBeNull()
  })

  it('rejects an unexpected response shape', async () => {
    const { target: t } = target(Response.json({ workflow_runs: [{ id: 'x' }] }))
    await expect(latestDeployRun(t)).rejects.toThrow()
  })
})
