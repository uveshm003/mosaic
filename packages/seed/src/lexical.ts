const base = { format: '' as const, indent: 0, version: 1, direction: 'ltr' as const }

function paragraph(text: string) {
  return {
    ...base,
    type: 'paragraph',
    textFormat: 0,
    textStyle: '',
    children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
  }
}

export function block(id: string, blockType: string, fields: Record<string, unknown>) {
  return {
    type: 'block',
    format: '' as const,
    version: 2,
    fields: { id, blockName: '', blockType, ...fields },
  }
}

export function heading(text: string, tag: 'h2' | 'h3' = 'h2') {
  return {
    ...base,
    type: 'heading',
    tag,
    children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
  }
}

type Node = ReturnType<typeof paragraph> | ReturnType<typeof block> | ReturnType<typeof heading>

/** Minimal Lexical document: strings become paragraphs, other nodes go in as they are. */
export function richText(content: (string | Node)[]) {
  return {
    root: {
      ...base,
      type: 'root',
      children: content.map((item) => (typeof item === 'string' ? paragraph(item) : item)),
    },
  }
}
