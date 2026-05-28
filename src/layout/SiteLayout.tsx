import { useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SiteHeader } from '../components/SiteHeader'
import { useHeaderMode } from '../hooks/useHeaderMode'
import { useRouteScroll } from '../hooks/useRouteScroll'
import { useScrollHeader } from '../hooks/useScrollHeader'
import { supportsViewTransitions } from '../lib/viewTransition'
import '../App.css'
import './transitions.css'

const useViewTransitions = supportsViewTransitions()

const HOME_SECTIONS = ['om-os', 'kontakt'] as const

export function SiteLayout() {
  const location = useLocation()
  const headerMode = useHeaderMode()
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

  const exitScrolledRef = useRef(scrolled)
  if (onJourneys) {
    exitScrolledRef.current = scrolled
  }

  const headerScrolled =
    onHome && headerMode !== 'home' ? exitScrolledRef.current : scrolled

  useRouteScroll(location)

  return (
    <div className="page">
      <SiteHeader
        headerMode={headerMode}
        scrolled={headerScrolled}
        scrollProgress={scrollProgress}
        activeSection={activeSection}
      />
      <div
        className={`page-view${useViewTransitions ? '' : ' page-view--css-fade'}`}
        key={useViewTransitions ? undefined : location.key}
      >
        <Outlet />
      </div>
    </div>
  )
}
