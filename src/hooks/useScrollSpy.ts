import { useEffect, useState } from 'react'

function getHeaderOffset() {
  const topbar = document.querySelector('.topbar')
  return (topbar?.getBoundingClientRect().height ?? 120) + 16
}

function pickByScrollPosition(sectionIds: readonly string[], headerOffset: number) {
  let current = sectionIds[0] ?? ''
  for (const id of sectionIds) {
    const el = document.getElementById(id)
    if (!el) continue
    if (el.getBoundingClientRect().top <= headerOffset + 72) {
      current = id
    }
  }
  return current
}

/**
 * Highlights the section that occupies the band below the fixed header.
 */
export function useScrollSpy(
  sectionIds: readonly string[],
  enabled = true,
): string {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (!enabled || sectionIds.length === 0) {
      setActiveId('')
      return
    }

    const ratios = new Map<string, number>()
    let observer: IntersectionObserver | undefined

    const updateActive = () => {
      const visible = sectionIds.filter((id) => (ratios.get(id) ?? 0) > 0.02)

      if (visible.length > 0) {
        let best = visible[0]
        let bestRatio = -1
        for (const id of visible) {
          const ratio = ratios.get(id) ?? 0
          if (ratio > bestRatio) {
            bestRatio = ratio
            best = id
          }
        }
        setActiveId(best)
        return
      }

      setActiveId(pickByScrollPosition(sectionIds, getHeaderOffset()))
    }

    const setupObserver = () => {
      observer?.disconnect()
      ratios.clear()

      const elements = sectionIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => Boolean(el))

      if (elements.length === 0) {
        setActiveId('')
        return
      }

      const top = getHeaderOffset()
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            ratios.set(entry.target.id, entry.intersectionRatio)
          }
          updateActive()
        },
        {
          root: null,
          rootMargin: `-${top}px 0px -52% 0px`,
          threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1],
        },
      )

      for (const el of elements) {
        observer.observe(el)
      }

      updateActive()
    }

    setupObserver()

    const onScroll = () => updateActive()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', setupObserver, { passive: true })

    const topbar = document.querySelector('.topbar')
    const resizeObserver =
      topbar && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(setupObserver)
        : undefined
    if (topbar && resizeObserver) resizeObserver.observe(topbar)

    const t1 = window.setTimeout(setupObserver, 100)
    const t2 = window.setTimeout(setupObserver, 450)
    window.addEventListener('nav-scroll-sync', setupObserver)

    return () => {
      window.removeEventListener('nav-scroll-sync', setupObserver)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      observer?.disconnect()
      resizeObserver?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', setupObserver)
    }
  }, [enabled, sectionIds.join('|')])

  return activeId
}
