import type { ProfileKey } from '@mosaic/content'
import Link from 'next/link'
import { enabledProfiles, isEnabled, profileHref } from '../lib/content'

// The one footer element every profile shares: quiet links to the other live profiles.
export function CrossLinks({ current, className }: { current: ProfileKey; className?: string }) {
  const links = [
    ...(current !== 'root' && isEnabled('root') ? [{ href: '/', label: 'About' }] : []),
    ...enabledProfiles()
      .filter(({ key }) => key !== current)
      .map(({ key, label }) => ({ href: profileHref[key], label })),
  ]
  if (links.length === 0) return null
  return (
    <nav aria-label="Other profiles" className={className}>
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
