import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { getPayload, type ServerProps } from 'payload'
import { parseCmsEnv } from '../env'
import { dispatchDeploy, latestDeployRun, type DeployRun } from '../publish/github'

function githubTarget() {
  const env = parseCmsEnv(process.env)
  return env.GITHUB_DISPATCH_TOKEN
    ? { token: env.GITHUB_DISPATCH_TOKEN, repo: env.GITHUB_REPO }
    : null
}

async function publish() {
  'use server'
  // Server actions are public endpoints, so check the caller again here.
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (user?.role !== 'admin') throw new Error('Only admins can publish.')
  const target = githubTarget()
  if (!target) throw new Error('GITHUB_DISPATCH_TOKEN is not set.')
  await dispatchDeploy(target)
  revalidatePath('/admin')
}

function describeRun(run: DeployRun) {
  const state = run.status === 'completed' ? (run.conclusion ?? 'completed') : run.status
  return `${state}, started ${new Date(run.created_at).toLocaleString('en-GB')}`
}

// Shown on the production admin's dashboard only; dev and demo never deploy.
export async function PublishPanel({ user }: ServerProps) {
  if (parseCmsEnv(process.env).APP_ENV !== 'production' || user?.role !== 'admin') return null
  const target = githubTarget()

  let status: React.ReactNode
  if (!target) {
    status = 'Set GITHUB_DISPATCH_TOKEN in apps/cms/.env.prod to publish from here.'
  } else {
    try {
      const run = await latestDeployRun(target)
      status = run ? (
        <>
          Last deploy: {describeRun(run)}. <a href={run.html_url}>View run</a>
        </>
      ) : (
        'No deploys yet.'
      )
    } catch (error) {
      status = error instanceof Error ? error.message : 'Couldn’t read deploy status.'
    }
  }

  return (
    <section style={{ marginTop: 'var(--base)' }}>
      <h2>Publish</h2>
      <p>Exports published content, builds both sites and deploys them to uveshm003.github.io.</p>
      <p>{status}</p>
      {target && (
        <form action={publish}>
          <button className="btn btn--style-primary btn--size-medium" type="submit">
            Publish
          </button>
        </form>
      )}
    </section>
  )
}
