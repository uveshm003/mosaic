import type { ReactNode } from 'react'

interface BlockFields {
  blockType?: string
  [field: string]: unknown
}

interface Node {
  type?: string
  fields?: BlockFields & { url?: string }
  text?: string
  format?: number | string
  tag?: string
  listType?: string
  url?: string
  children?: Node[]
}

const BOLD = 1
const ITALIC = 2
const CODE = 16

function text(node: Node, key: number): ReactNode {
  let out: ReactNode = node.text ?? ''
  const format = typeof node.format === 'number' ? node.format : 0
  if (format & CODE) out = <code key={key}>{out}</code>
  if (format & ITALIC) out = <em key={key}>{out}</em>
  if (format & BOLD) out = <strong key={key}>{out}</strong>
  return out
}

function render(nodes: Node[] | undefined, className?: string): ReactNode[] {
  return (nodes ?? []).map((node, i) => {
    const children = render(node.children)
    switch (node.type) {
      case 'text':
        return text(node, i)
      case 'linebreak':
        return <br key={i} />
      case 'paragraph':
        return (
          <p key={i} className={className}>
            {children}
          </p>
        )
      case 'heading': {
        const Tag = node.tag === 'h3' ? 'h3' : node.tag === 'h4' ? 'h4' : 'h2'
        return <Tag key={i}>{children}</Tag>
      }
      case 'list': {
        // Tailwind's reset removes list markers; a write-up needs them back.
        return node.listType === 'number' ? (
          <ol key={i} className="list-decimal space-y-1 pl-6">
            {children}
          </ol>
        ) : (
          <ul key={i} className="list-disc space-y-1 pl-6">
            {children}
          </ul>
        )
      }
      case 'listitem':
        return <li key={i}>{children}</li>
      case 'link':
        return (
          <a key={i} href={str(node.fields?.url) || node.url || '#'}>
            {children}
          </a>
        )
      case 'block':
        return <Block key={i} fields={node.fields ?? {}} />
      default:
        return null
    }
  })
}

const str = (value: unknown) => (typeof value === 'string' ? value : '')
const rows = (value: unknown) => (Array.isArray(value) ? (value as Record<string, unknown>[]) : [])

const storeLabel: Record<string, string> = {
  'app-store': 'App Store',
  'play-store': 'Google Play',
  'microsoft-store': 'Microsoft Store',
  'mac-app-store': 'Mac App Store',
  other: 'Download',
}

// Plain, accessible markup for each custom block. Shiki highlighting, Mermaid SVGs and the
// click-to-load players for YouTube and Flutter demos replace these step by step.
function Block({ fields }: { fields: BlockFields }) {
  switch (fields.blockType) {
    case 'code':
      return (
        <figure className="my-6 overflow-hidden border border-line">
          <figcaption className="border-b border-line bg-surface px-3 py-1.5 font-mono text-xs text-muted">
            {str(fields.filename) || str(fields.language)}
          </figcaption>
          <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed">
            <code>{str(fields.code)}</code>
          </pre>
        </figure>
      )
    case 'mermaid':
      return (
        <figure className="my-6">
          <pre className="overflow-x-auto border border-line bg-surface p-4 font-mono text-xs">
            {str(fields.definition)}
          </pre>
          {str(fields.caption) && (
            <figcaption className="mt-2 text-sm text-muted">{str(fields.caption)}</figcaption>
          )}
        </figure>
      )
    case 'youtube':
      return (
        <p className="my-6">
          <a href={str(fields.url)} className="underline decoration-accent underline-offset-4">
            Watch on YouTube: {str(fields.title)}
          </a>
        </p>
      )
    case 'flutterDemo':
      return (
        <figure className="my-6 grid aspect-video place-items-center border border-line bg-surface">
          <figcaption className="text-sm text-muted">
            {str(fields.title)}: interactive demo, loads on click
          </figcaption>
        </figure>
      )
    case 'image': {
      const image = fields.image as { url?: string; alt?: string } | null | undefined
      const url = image?.url && /^https?:\/\//.test(image.url) ? image.url : null
      return (
        <figure className="my-6">
          {url ? (
            // Static export: no runtime optimizer; Payload's generated sizes become srcset (spec: Rendering).
            <img src={url} alt={image?.alt ?? ''} className="w-full" loading="lazy" />
          ) : (
            <div role="img" aria-label={image?.alt ?? ''} className="aspect-video bg-surface" />
          )}
          {str(fields.caption) && (
            <figcaption className="mt-2 text-sm text-muted">{str(fields.caption)}</figcaption>
          )}
        </figure>
      )
    }
    case 'callout':
      return (
        <aside role="note" className="my-6 border-l-2 border-accent bg-surface px-4 py-3">
          <p className="mb-1 font-mono text-xs text-muted uppercase">
            {str(fields.tone) || 'note'}
          </p>
          <p>{str(fields.text)}</p>
        </aside>
      )
    case 'metrics':
      return (
        <dl className="my-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {rows(fields.items).map((item, i) => (
            <div key={i} className="border-t border-fg pt-2">
              <dt className="text-sm text-muted">{str(item.label)}</dt>
              <dd className="text-2xl font-medium">{str(item.value)}</dd>
            </div>
          ))}
        </dl>
      )
    case 'storeLinks':
      return (
        <ul className="my-6 flex flex-wrap gap-3">
          {rows(fields.links).map((link, i) => (
            <li key={i}>
              <a href={str(link.url)} className="inline-block border border-fg px-3 py-1.5 text-sm">
                {storeLabel[str(link.store)] ?? 'Download'}
              </a>
            </li>
          ))}
        </ul>
      )
    default:
      return null
  }
}

/** Minimal Lexical renderer for paragraphs, headings, lists, links and inline formats. */
export function RichText({
  value,
  paragraphClassName,
}: {
  value: unknown
  paragraphClassName?: string
}) {
  const root = (value as { root?: Node } | null | undefined)?.root
  return <>{render(root?.children, paragraphClassName)}</>
}
