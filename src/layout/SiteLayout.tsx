import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SiteHeader } from '../components/SiteHeader'
import { useScrollHeader } from '../hooks/useScrollHeader'
import '../App.css'
import './transitions.css'

const HOME_SECTIONS = ['om-os', 'kontakt'] as const

export function SiteLayout() {
  const location = useLocation()
  const onHome = location.pathname === '/'
  const onJourneys = location.pathname.startsWith('/vores-rejser')

  const heroSelector = onHome ? '#om-os' : '.subpage-hero'
  const spySections = onHome
    ? HOME_SECTIONS
    : onJourneys
      ? (['rejser', 'instagram'] as const)
      : undefined

  const { scrolled, scrollProgress, activeSection } = useScrollHeader({
    heroSelector,
    spySections,
    clearSpyBelowHero: onJourneys,
  })

  useEffect(() => {
    const syncScroll = () => {
      window.dispatchEvent(new Event('scroll'))
      window.dispatchEvent(new Event('nav-scroll-sync'))
    }

    if (location.hash) {
      const id = location.hash.replace(/^#/, '')
      const el = document.getElementById(id)
      if (el) {
        window.setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          window.setTimeout(syncScroll, 50)
          window.setTimeout(syncScroll, 450)
        }, 100)
        return
      }
    }

    window.scrollTo({ top: 0, left: 0 })
    window.setTimeout(syncScroll, 50)
    window.setTimeout(syncScroll, 300)
  }, [location.pathname, location.hash])

  return (
    <div className="page">
      <SiteHeader
        scrolled={scrolled}
        scrollProgress={scrollProgress}
        activeSection={activeSection}
      />
      <div className="page-view" key={location.pathname}>
        <Outlet />
      </div>
    </div>
  )
}
