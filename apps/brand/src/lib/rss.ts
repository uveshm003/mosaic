import type { Post } from '@mosaic/content/payload-types'
import { excerpt, postPath, typeSingular } from './content'

const escape = (text: string) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

/** RSS 2.0 for published posts, newest first. */
export function buildRss(posts: Post[], feed: { title: string; url: string; description: string }) {
  const items = posts
    .filter((p) => p._status !== 'draft' && p.publishedAt)
    .map((p) => {
      const link = `${feed.url}${postPath(p)}`
      return [
        '    <item>',
        `      <title>${escape(p.title)}</title>`,
        `      <link>${escape(link)}</link>`,
        `      <guid isPermaLink="true">${escape(link)}</guid>`,
        `      <category>${escape(typeSingular[p.type])}</category>`,
        `      <pubDate>${new Date(p.publishedAt ?? '').toUTCString()}</pubDate>`,
        `      <description>${escape(excerpt(p, 300))}</description>`,
        '    </item>',
      ].join('\n')
    })
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escape(feed.title)}</title>`,
    `    <link>${escape(feed.url)}/</link>`,
    `    <atom:link href="${escape(feed.url)}/rss.xml" rel="self" type="application/rss+xml" />`,
    `    <description>${escape(feed.description)}</description>`,
    '    <language>en</language>',
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')
}
