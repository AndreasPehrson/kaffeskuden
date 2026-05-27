import { routes } from './assets'

export type NavItem =
  | {
      id: string
      label: string
      to: string
      kind: 'page'
      /** Only match exact path (e.g. forsiden without hash). */
      end?: boolean
    }
  | {
      id: string
      label: string
      to: { pathname: string; hash: string }
      kind: 'section'
    }

/** Primary site navigation (all pages). */
export const mainNav: NavItem[] = [
  { id: 'hjem', label: 'Hjem', to: routes.home, kind: 'page', end: true },
  { id: 'rejser', label: 'Vores rejser', to: routes.journeys, kind: 'page' },
  {
    id: 'kontakt',
    label: 'Kontakt',
    to: { pathname: routes.home, hash: '#kontakt' },
    kind: 'section',
  },
]

/** In-page anchors on /vores-rejser (second row under main nav). */
export const journeysSubNav = [
  { id: 'rejser', label: 'Historier', hash: '#rejser' },
  { id: 'instagram', label: 'Instagram', hash: '#instagram' },
  { id: 'galleri', label: 'Galleri', hash: '#galleri' },
] as const

export const contactLink = {
  pathname: routes.home,
  hash: '#kontakt',
} as const
