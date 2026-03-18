'use client'

import { useEffect, useRef } from 'react'
import { useSplashStore } from '@/store/splashStore'

const MIN_DISPLAY_MS = 1800
const INIT_TIMEOUT_MS = 10000

export function useAppInitializer() {
  const { setStatus, setError } = useSplashStore()
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const start = Date.now()

    const timeoutId = setTimeout(() => {
      setError("We're having trouble loading SkillMind. Please try again.")
    }, INIT_TIMEOUT_MS)

    const run = async () => {
      try {
        await Promise.all([
          checkApiHealth(),
          validateUserSession(),
        ])

        const elapsed = Date.now() - start
        const remaining = MIN_DISPLAY_MS - elapsed
        if (remaining > 0) await delay(remaining)

        clearTimeout(timeoutId)
        setStatus('ready')
      } catch {
        clearTimeout(timeoutId)
        setError("We're having trouble loading SkillMind. Please try again.")
      }
    }

    run()
    return () => clearTimeout(timeoutId)
  }, [setStatus, setError])
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

async function checkApiHealth(): Promise<void> {
  try {
    const res = await fetch('/api/health', { signal: AbortSignal.timeout(5000), cache: 'no-store' })
    if (!res.ok) throw new Error('API health check failed')
  } catch {
    console.warn('[SkillMind] Health check unavailable.')
  }
}

async function validateUserSession(): Promise<void> {
  try {
    const res = await fetch('/api/auth/session', { credentials: 'include', signal: AbortSignal.timeout(5000) })
    if (!res.ok && res.status !== 401) throw new Error('Session validation failed')
  } catch {
    console.warn('[SkillMind] Session unavailable.')
  }
}