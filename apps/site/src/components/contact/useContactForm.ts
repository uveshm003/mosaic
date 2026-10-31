'use client'

import type { ProfileKey } from '@mosaic/content'
import { useRef, useState } from 'react'

export type ContactStatus =
  { kind: 'idle' | 'sending' | 'sent' } | { kind: 'error'; message: string }

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: { sitekey: string; theme?: string }) => string
      getResponse: (id: string) => string | undefined
      reset: (id: string) => void
    }
  }
}

/**
 * Posts to the contact Worker from any profile; each profile draws its own form.
 * Turnstile loads only once someone starts filling the form in.
 */
export function useContactForm(options: {
  endpoint: string
  siteKey: string
  profile: ProfileKey
  theme?: 'light' | 'dark' | 'auto'
}) {
  const [status, setStatus] = useState<ContactStatus>({ kind: 'idle' })
  const widget = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const loading = useRef(false)

  const loadTurnstile = () => {
    if (loading.current) return
    loading.current = true
    const render = () => {
      if (window.turnstile && widget.current) {
        widgetId.current = window.turnstile.render(widget.current, {
          sitekey: options.siteKey,
          theme: options.theme ?? 'auto',
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
    const optional = (name: string) => {
      const value = form.get(name)
      return typeof value === 'string' && value ? value : undefined
    }
    setStatus({ kind: 'sending' })
    try {
      const response = await fetch(options.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: options.profile,
          name: form.get('name'),
          email: form.get('email'),
          message: form.get('message'),
          projectType: optional('projectType'),
          timeline: optional('timeline'),
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

  return { status, submit, loadTurnstile, widget }
}
