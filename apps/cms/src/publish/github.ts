import { z } from 'zod'

const WORKFLOW = 'deploy.yml'

const runsSchema = z.object({
  workflow_runs: z.array(
    z.object({
      id: z.number(),
      status: z.string(),
      conclusion: z.string().nullable(),
      html_url: z.url(),
      created_at: z.iso.datetime(),
      event: z.string(),
    }),
  ),
})

export type DeployRun = z.infer<typeof runsSchema>['workflow_runs'][number]

export interface GitHubTarget {
  token: string
  /** `owner/name` */
  repo: string
  fetch?: typeof fetch
}

function request(target: GitHubTarget, path: string, init: RequestInit = {}) {
  return (target.fetch ?? fetch)(`https://api.github.com/repos/${target.repo}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${target.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
}

/** Starts the deploy workflow on main, which exports, builds and publishes both sites. */
export async function dispatchDeploy(target: GitHubTarget): Promise<void> {
  const response = await request(target, `/actions/workflows/${WORKFLOW}/dispatches`, {
    method: 'POST',
    body: JSON.stringify({ ref: 'main' }),
  })
  if (response.status !== 204) {
    throw new Error(`GitHub refused the deploy (HTTP ${String(response.status)}).`)
  }
}

export async function latestDeployRun(target: GitHubTarget): Promise<DeployRun | null> {
  const response = await request(target, `/actions/workflows/${WORKFLOW}/runs?per_page=1`)
  if (!response.ok) {
    throw new Error(`Couldn't read deploy runs (HTTP ${String(response.status)}).`)
  }
  const { workflow_runs } = runsSchema.parse(await response.json())
  return workflow_runs[0] ?? null
}
