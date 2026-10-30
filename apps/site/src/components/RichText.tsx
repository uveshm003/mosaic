import type { ReactNode } from 'react'

interface Node {
  type?: string
  text?: string
  format?: number | string
  tag?: string
  listType?: string
  url?: string
  fields?: { url?: string }
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
        const Tag = node.listType === 'number' ? 'ol' : 'ul'
        return <Tag key={i}>{children}</Tag>
      }
      case 'listitem':
        return <li key={i}>{children}</li>
      case 'link':
        return (
          <a key={i} href={node.fields?.url ?? node.url ?? '#'}>
            {children}
          </a>
        )
      // Custom blocks render once the chosen direction is built out.
      default:
        return null
    }
  })
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
