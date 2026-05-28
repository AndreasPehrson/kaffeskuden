import { useLayoutEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { HEADER_HANDOFF_MS, PAGE_TRANSITION_MS } from '../lib/motion'
import { supportsViewTransitions } from '../lib/viewTransition'

export type HeaderMode = 'home' | 'journeys'

function modeFromPath(pathname: string): HeaderMode {
  return pathname.startsWith('/vores-rejser') ? 'journeys' : 'home'
}

/**
 * Keeps journeys header chrome until the page transition finishes, then
 * hands off to home styles with a short delay so the fade feels connected.
 */
export function useHeaderMode(): HeaderMode {
  const { pathname } = useLocation()
  const [headerMode, setHeaderMode] = useState<HeaderMode>(() => modeFromPath(pathname))

  useLayoutEffect(() => {
    if (modeFromPath(pathname) === 'journeys') {
      setHeaderMode('journeys')
      return
    }

    if (!supportsViewTransitions()) {
      setHeaderMode('home')
      return
    }

    let cancelled = false
    const applyHome = () => {
      window.setTimeout(() => {
        if (!cancelled) setHeaderMode('home')
      }, HEADER_HANDOFF_MS)
    }

    document.addEventListener('viewtransitionend', applyHome, { once: true })
    const fallback = window.setTimeout(applyHome, PAGE_TRANSITION_MS + 40)

    return () => {
      cancelled = true
      document.removeEventListener('viewtransitionend', applyHome)
      window.clearTimeout(fallback)
    }
  }, [pathname])

  return headerMode
}
