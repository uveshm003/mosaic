import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'
import { slugError, youTubeUrlError } from './rules'

export const codeLanguages = [
  'dart',
  'kotlin',
  'swift',
  'typescript',
  'javascript',
  'json',
  'yaml',
  'bash',
  'sql',
  'plaintext',
] as const

const storeOptions = ['app-store', 'play-store', 'microsoft-store', 'mac-app-store', 'other']

// Rendered at build time on the sites (Shiki for code, SVG for Mermaid); these define data only.
export const CodeBlock: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  fields: [
    { name: 'language', type: 'select', required: true, options: [...codeLanguages] },
    { name: 'code', type: 'code', required: true },
    { name: 'filename', type: 'text' },
  ],
}

export const MermaidBlock: Block = {
  slug: 'mermaid',
  interfaceName: 'MermaidBlock',
  labels: { singular: 'Mermaid diagram', plural: 'Mermaid diagrams' },
  fields: [
    { name: 'definition', type: 'code', required: true, admin: { language: 'markdown' } },
    { name: 'caption', type: 'text' },
  ],
}

export const YouTubeBlock: Block = {
  slug: 'youtube',
  interfaceName: 'YouTubeBlock',
  labels: { singular: 'YouTube video', plural: 'YouTube videos' },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      validate: (value: unknown) => youTubeUrlError(value) ?? true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Used as the player’s accessible name.' },
    },
  ],
}

export const FlutterDemoBlock: Block = {
  slug: 'flutterDemo',
  interfaceName: 'FlutterDemoBlock',
  labels: { singular: 'Flutter demo', plural: 'Flutter demos' },
  fields: [
    {
      name: 'demo',
      type: 'text',
      required: true,
      validate: (value: unknown) => slugError(value) ?? true,
      admin: { description: 'Folder name under demos/flutter.' },
    },
    { name: 'title', type: 'text', required: true },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Shown until the visitor clicks to load the demo.' },
    },
  ],
}

export const ImageBlock: Block = {
  slug: 'image',
  interfaceName: 'ImageBlock',
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text' },
  ],
}

export const CalloutBlock: Block = {
  slug: 'callout',
  interfaceName: 'CalloutBlock',
  fields: [
    {
      name: 'tone',
      type: 'select',
      required: true,
      defaultValue: 'note',
      options: ['note', 'tip', 'warning'],
    },
    { name: 'text', type: 'textarea', required: true },
  ],
}

export const MetricsBlock: Block = {
  slug: 'metrics',
  interfaceName: 'MetricsBlock',
  labels: { singular: 'Metrics row', plural: 'Metrics rows' },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      admin: { description: 'Only metrics Uvesh has supplied and approved.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
  ],
}

export const StoreLinksBlock: Block = {
  slug: 'storeLinks',
  interfaceName: 'StoreLinksBlock',
  labels: { singular: 'Store links', plural: 'Store links' },
  fields: [
    {
      name: 'links',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        { name: 'store', type: 'select', required: true, options: storeOptions },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}

export const richTextBlocks = [
  CodeBlock,
  MermaidBlock,
  YouTubeBlock,
  FlutterDemoBlock,
  ImageBlock,
  CalloutBlock,
  MetricsBlock,
  StoreLinksBlock,
]

// Images go through the image block (caption, snapshot export), and inline links to other
// documents are off because they could point at unpublished work.
const removedFeatures = new Set(['upload', 'relationship'])

export const richTextEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter((feature) => !removedFeatures.has(feature.key)),
    BlocksFeature({ blocks: richTextBlocks }),
  ],
})
