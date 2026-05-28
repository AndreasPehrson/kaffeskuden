import { useLayoutEffect } from 'react'
import type { Location } from 'react-router-dom'
import { PAGE_TRANSITION_MS } from '../lib/motion'

function syncNavScroll() {
  window.dispatchEvent(new Event('scroll'))
  window.dispatchEvent(new Event('nav-scroll-sync'))
}

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
}

/** Scroll + header sync on route change without fighting view transitions. */
export function useRouteScroll(location: Location) {
  useLayoutEffect(() => {
    if (location.hash) {
      const id = location.hash.replace(/^#/, '')
      const el = document.getElementById(id)
      if (!el) return

      const scrollToHash = () => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        window.setTimeout(syncNavScroll, 50)
        window.setTimeout(syncNavScroll, 450)
      }

      window.setTimeout(scrollToHash, 80)
      return
    }

    scrollToTop()

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || !document.startViewTransition) {
      syncNavScroll()
      return
    }

    syncNavScroll()

    const onTransitionEnd = () => {
      syncNavScroll()
    }

    document.addEventListener('viewtransitionend', onTransitionEnd, { once: true })
    const fallback = window.setTimeout(onTransitionEnd, PAGE_TRANSITION_MS + 40)

    return () => {
      document.removeEventListener('viewtransitionend', onTransitionEnd)
      window.clearTimeout(fallback)
    }
  }, [location.pathname, location.hash])
}
