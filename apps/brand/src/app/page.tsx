import Link from 'next/link'

// Placeholder until the brand site is built in Phase 3. Lists the design directions
// under review.
export default function Home() {
  return (
    <main
      style={{ maxWidth: '40rem', margin: '0 auto', padding: '4rem 1rem', fontFamily: 'system-ui' }}
    >
      <p>Coming soon.</p>
      <ul>
        <li>
          <Link href="/directions/billboard">A. Billboard</Link>
        </li>
        <li>
          <Link href="/directions/posters">B. Poster wall</Link>
        </li>
        <li>
          <Link href="/directions/studio">C. Studio 3D</Link>
        </li>
      </ul>
    </main>
  )
}
