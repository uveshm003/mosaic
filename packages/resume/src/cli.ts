// pnpm resume:export --variant <ProductCompany|Android|Flutter|Broad|Fullstack|all> [--out <dir>]
// Writes Markdown from the content snapshot; the PDF step stays outside the repo.
import { resumeVariantNames, resumeVariants, type ResumeVariant } from '@mosaic/content'
import { loadSnapshot, SNAPSHOT_PATH } from '@mosaic/content/snapshot'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { renderResume } from './render'

const repoRoot = path.resolve(import.meta.dirname, '../../..')

const { values } = parseArgs({
  args: process.argv.slice(2).filter((arg) => arg !== '--'),
  options: {
    variant: { type: 'string', default: 'all' },
    out: { type: 'string', default: path.join(repoRoot, 'exports/resume') },
  },
})

const byName = new Map(
  Object.entries(resumeVariantNames).map(([key, name]) => [
    name.toLowerCase(),
    key as ResumeVariant,
  ]),
)
const requested = values.variant.toLowerCase()
const variants: ResumeVariant[] =
  requested === 'all' ? [...resumeVariants] : [byName.get(requested)].filter((v) => v !== undefined)
if (variants.length === 0) {
  console.error(
    `Unknown variant "${values.variant}". Use one of: ${Object.values(resumeVariantNames).join(', ')}, all.`,
  )
  process.exit(1)
}

const snapshot = loadSnapshot(path.join(repoRoot, SNAPSHOT_PATH), { production: false })
const { collections, globals } = snapshot
if (snapshot.appEnv !== 'production') {
  console.warn(
    `Note: this snapshot is from ${snapshot.appEnv}, not production; the output holds sample data.`,
  )
}

mkdirSync(values.out, { recursive: true })
for (const variant of variants) {
  const markdown = renderResume(
    {
      person: globals.person,
      experience: collections.experience,
      education: collections.education,
      skills: collections.skills,
      projects: collections.projects,
    },
    variant,
  )
  const file = path.join(values.out, `Uvesh_Resume_${resumeVariantNames[variant]}.md`)
  writeFileSync(file, markdown)
  console.log(`Wrote ${path.relative(repoRoot, file)}`)
}
