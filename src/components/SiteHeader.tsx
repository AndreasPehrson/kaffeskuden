import { type CSSProperties } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { brand } from '../content/assets'
import { contactLink, journeysSubNav, mainNav } from '../content/navigation'
import { useJourneysSubnavActive } from '../hooks/useJourneysSubnavActive'
import { useTopbarHeight } from '../hooks/useTopbarHeight'
import { PageLink } from './PageLink'

type SiteHeaderProps = {
  scrolled: boolean
  scrollProgress: number
  activeSection?: string
}

export function SiteHeader({
  scrolled,
  scrollProgress,
  activeSection = '',
}: SiteHeaderProps) {
  const { pathname, hash } = useLocation()
  const onHome = pathname === '/'
  const onJourneysPage = pathname.startsWith('/vores-rejser')

  const isHomeActive =
    onHome &&
    (activeSection === '' || activeSection === 'om-os') &&
    hash !== '#kontakt'

  const isKontaktActive =
    hash === '#kontakt' || (onHome && activeSection === 'kontakt')

  const journeysSubnav = useJourneysSubnavActive(
    hash,
    onJourneysPage,
    activeSection,
  )

  const headerRef = useTopbarHeight()

  return (
    <header
      ref={headerRef}
      className={`topbar${scrolled ? ' topbar--scrolled' : ''}${isKontaktActive ? ' topbar--over-contact' : ''}${onJourneysPage ? ' topbar--subpage topbar--with-subnav' : ''}`}
      data-scrolled={scrolled}
    >
      <PageLink className="brand" to="/" aria-label="Kaffeskuden hjem">
        <img src={brand.logo} alt="" />
        <span>Kaffeskuden</span>
      </PageLink>

      <div className="topbar-nav-wrap">
        <nav className="topbar-nav" aria-label="Sider">
          {mainNav.map((item) => {
            if (item.kind === 'page') {
              if (item.id === 'hjem') {
                return (
                  <PageLink
                    key={item.id}
                    to={item.to}
                    viewTransition
                    className={isHomeActive ? 'is-active' : undefined}
                    aria-current={isHomeActive ? 'page' : undefined}
                  >
                    {item.label}
                  </PageLink>
                )
              }

              const journeysActive =
                pathname === item.to || pathname.startsWith(`${item.to}/`)

              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  viewTransition
                  className={journeysActive ? 'is-active' : undefined}
                  aria-current={journeysActive ? 'page' : undefined}
                >
                  {item.label}
                </NavLink>
              )
            }

            return (
              <PageLink
                key={item.id}
                to={item.to}
                viewTransition
                className={isKontaktActive ? 'is-active' : undefined}
                aria-current={isKontaktActive ? 'location' : undefined}
              >
                {item.label}
              </PageLink>
            )
          })}
        </nav>

        {onJourneysPage && (
          <nav className="topbar-subnav" aria-label="På siden Vores rejser">
            {journeysSubNav.map((item) => {
              const active = journeysSubnav.isActive(item.id)
              return (
                <PageLink
                  key={item.id}
                  to={{ pathname: '/vores-rejser', hash: item.hash }}
                  viewTransition={false}
                  replace
                  onPointerDown={() => journeysSubnav.select(item.id)}
                  className={active ? 'is-active' : undefined}
                  aria-current={active ? 'location' : undefined}
                >
                  {item.label}
                </PageLink>
              )
            })}
          </nav>
        )}
      </div>

      <PageLink className="topbar-cta" to={contactLink}>
        Skriv til os
      </PageLink>

      <span
        className="topbar-progress"
        style={{ '--progress': scrollProgress } as CSSProperties}
        aria-hidden="true"
      />
    </header>
  )
}
