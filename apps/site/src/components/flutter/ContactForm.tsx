'use client'

import { useRef, useState } from 'react'

type Status = { kind: 'idle' | 'sending' | 'sent' } | { kind: 'error'; message: string }

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: { sitekey: string; theme?: string }) => string
      getResponse: (id: string) => string | undefined
      reset: (id: string) => void
    }
  }
}

// Posts to the contact Worker. Turnstile loads only once someone starts filling the form in.
export function ContactForm({ endpoint, siteKey }: { endpoint: string; siteKey: string }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const widget = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const loading = useRef(false)

  const loadTurnstile = () => {
    if (loading.current) return
    loading.current = true
    const render = () => {
      if (window.turnstile && widget.current) {
        widgetId.current = window.turnstile.render(widget.current, {
          sitekey: siteKey,
          theme: 'dark',
        })
      }
    }
    if (window.turnstile) {
      render()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.onload = render
    document.head.append(script)
  }

  const submit = async (formElement: HTMLFormElement) => {
    const form = new FormData(formElement)
    const token = widgetId.current ? window.turnstile?.getResponse(widgetId.current) : undefined
    if (!token) {
      setStatus({ kind: 'error', message: 'Please complete the check above the button.' })
      return
    }
    setStatus({ kind: 'sending' })
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: 'root',
          name: form.get('name'),
          email: form.get('email'),
          message: form.get('message'),
          website: form.get('website'),
          turnstileToken: token,
        }),
      })
      if (!response.ok) throw new Error(String(response.status))
      setStatus({ kind: 'sent' })
    } catch {
      setStatus({
        kind: 'error',
        message: 'That didn’t go through. Please try again, or email me instead.',
      })
      if (widgetId.current) window.turnstile?.reset(widgetId.current)
    }
  }

  if (status.kind === 'sent') {
    return (
      <p role="status" className="card p-6 text-lg">
        Thanks! Your message is on its way. I’ll reply by email.
      </p>
    )
  }

  const field =
    'w-full rounded-xl border border-line bg-surface px-4 py-3 outline-none transition placeholder:text-muted/70 focus:border-accent'
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void submit(event.currentTarget)
      }}
      onFocus={loadTurnstile}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Name
          <input
            name="name"
            required
            maxLength={100}
            autoComplete="name"
            className={`${field} mt-1.5`}
          />
        </label>
        <label className="block text-sm">
          Email
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            className={`${field} mt-1.5`}
          />
        </label>
      </div>
      <label className="block text-sm">
        Message
        <textarea
          name="message"
          required
          maxLength={2000}
          rows={5}
          className={`${field} mt-1.5 resize-y`}
        />
      </label>
      {/* Honeypot: hidden from people and screen readers. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div ref={widget} className="min-h-[65px]" />
      {status.kind === 'error' && (
        <p role="alert" className="text-sm text-accent-2">
          {status.message}
        </p>
      )}
      <button
        type="submit"
        disabled={status.kind === 'sending'}
        className="rounded-full bg-accent px-6 py-3 font-medium text-accent-fg transition hover:brightness-110 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {status.kind === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
