import { useEffect, useRef, useState } from 'react'
import { useScrollSpy } from './useScrollSpy'

type UseScrollHeaderOptions = {
  heroSelector: string
  spySections?: readonly string[]
  /** While the page hero is visible, in-page section links stay unhighlighted. */
  clearSpyBelowHero?: boolean
}

export function useScrollHeader({
  heroSelector,
  spySections,
  clearSpyBelowHero = false,
}: UseScrollHeaderOptions) {
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [heroCoversHeader, setHeroCoversHeader] = useState(false)

  const rawActiveSection = useScrollSpy(spySections ?? [], Boolean(spySections?.length))

  const activeSection =
    clearSpyBelowHero && heroCoversHeader ? '' : rawActiveSection

  const scrolledLatchedRef = useRef(false)

  useEffect(() => {
    scrolledLatchedRef.current = false
    setScrolled(false)
    setScrollProgress(0)
    setHeroCoversHeader(false)
  }, [heroSelector])

  useEffect(() => {
    const getHeaderOffset = () => {
      const topbar = document.querySelector('.topbar')
      return (topbar?.getBoundingClientRect().height ?? 120) + 16
    }

    const updateHeader = () => {
      const headerOffset = getHeaderOffset()
      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0

      const hero = document.querySelector(heroSelector)
      const heroBottom = hero?.getBoundingClientRect().bottom ?? window.innerHeight
      const coversHeader = heroBottom > headerOffset + 24
      setHeroCoversHeader(coversHeader)

      if (clearSpyBelowHero) {
        if (heroBottom <= headerOffset) {
          scrolledLatchedRef.current = true
        }
        if (scrollTop < 8) {
          scrolledLatchedRef.current = false
        }
        setScrolled(scrolledLatchedRef.current)
      } else {
        setScrolled(heroBottom <= headerOffset)
      }

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(
        maxScroll > 0 ? Math.min(1, scrollTop / maxScroll) : 0,
      )
    }

    updateHeader()
    const t1 = window.setTimeout(updateHeader, 120)
    const t2 = window.setTimeout(updateHeader, 450)

    window.addEventListener('scroll', updateHeader, { passive: true })
    window.addEventListener('resize', updateHeader, { passive: true })
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.removeEventListener('scroll', updateHeader)
      window.removeEventListener('resize', updateHeader)
    }
  }, [heroSelector, spySections, clearSpyBelowHero])

  return { scrolled, scrollProgress, activeSection }
}
