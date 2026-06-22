import { Outlet, useLocation } from 'react-router-dom'
import { SiteHeader } from '../components/SiteHeader'
import { usePageAnalytics } from '../hooks/usePageAnalytics'
import { useRouteScroll } from '../hooks/useRouteScroll'
import { useScrollHeader } from '../hooks/useScrollHeader'
import { supportsViewTransitions } from '../lib/viewTransition'
import '../App.css'
import './transitions.css'

const useViewTransitions = supportsViewTransitions()

const HOME_SECTIONS = ['om-os', 'kontakt'] as const

export function SiteLayout() {
  const location = useLocation()
  const onJourneys = location.pathname.startsWith('/vores-rejser')

  const heroSelector = location.pathname === '/' ? '#om-os' : '.subpage-hero'
  const spySections =
    location.pathname === '/'
      ? HOME_SECTIONS
      : onJourneys
        ? (['rejser', 'instagram'] as const)
        : undefined

  const { scrolled, scrollProgress, activeSection } = useScrollHeader({
    heroSelector,
    spySections,
    clearSpyBelowHero: onJourneys,
  })

  useRouteScroll(location)
  usePageAnalytics()

  return (
    <div className="page">
      <a className="skip-link" href="#indhold">
        Spring til indhold
      </a>
      <SiteHeader
        scrolled={scrolled}
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
