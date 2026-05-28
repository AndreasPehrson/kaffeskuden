import { useEffect, useRef } from 'react'

/** Sync --topbar-height / --header-offset to the fixed header’s rendered height. */
export function useTopbarHeight() {
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = headerRef.current
    if (!node) return

    let frame = 0
    const apply = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const height = Math.ceil(node.getBoundingClientRect().height)
        document.documentElement.style.setProperty('--topbar-height', `${height}px`)
        document.documentElement.style.setProperty('--header-offset', `${height}px`)
      })
    }

    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(node)
    window.addEventListener('orientationchange', apply)

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('orientationchange', apply)
    }
  }, [])

  return headerRef
}
