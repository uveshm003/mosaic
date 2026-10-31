import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="px-5 py-[16svh] sm:px-10">
      <h1 className="font-serif text-[clamp(3rem,10vw,8rem)] leading-none italic">
        Not on the wall.
      </h1>
      <p className="mt-6 text-lg">
        That page doesn’t exist, or hasn’t been written yet.{' '}
        <Link href="/" className="underline decoration-accent underline-offset-4">
          Back to everything
        </Link>
        .
      </p>
    </section>
  )
}
