import type { CSSProperties } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { brand } from '../content/assets'
import { contactLink, journeysSubNav, mainNav } from '../content/navigation'
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
  const onJourneys = pathname.startsWith('/vores-rejser')

  const isHomeActive =
    onHome &&
    (activeSection === '' || activeSection === 'om-os') &&
    hash !== '#kontakt'

  const isKontaktActive =
    hash === '#kontakt' || (onHome && activeSection === 'kontakt')

  return (
    <header
      className={`topbar${scrolled ? ' topbar--scrolled' : ''}${onJourneys ? ' topbar--subpage' : ''}${onJourneys ? ' topbar--with-subnav' : ''}`}
      data-scrolled={scrolled}
    >
      <PageLink className="brand" to="/" aria-label="Kaffeskuden hjem">
        <img src={brand.logo} alt="Kaffeskuden logo" />
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

              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  viewTransition
                  className={({ isActive }) => (isActive ? 'is-active' : undefined)}
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
                aria-current={isKontaktActive ? 'page' : undefined}
              >
                {item.label}
              </PageLink>
            )
          })}
        </nav>

        {onJourneys && (
          <nav className="topbar-subnav" aria-label="På siden Vores rejser">
            {journeysSubNav.map((item) => {
              const active = hash === item.hash || activeSection === item.id
              return (
                <PageLink
                  key={item.id}
                  to={{ pathname: '/vores-rejser', hash: item.hash }}
                  viewTransition
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
