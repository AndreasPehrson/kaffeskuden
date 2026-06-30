import { Link, type LinkProps } from 'react-router-dom'
import { supportsViewTransitions } from '../lib/viewTransition'

type PageLinkProps = LinkProps & {
  children: React.ReactNode
}

/** In-app link; uses View Transitions with RouterProvider (createBrowserRouter). */
export function PageLink({
  children,
  viewTransition = supportsViewTransitions(),
  ...props
}: PageLinkProps) {
  return (
    <Link viewTransition={viewTransition} {...props}>
      {children}
    </Link>
  )
}
