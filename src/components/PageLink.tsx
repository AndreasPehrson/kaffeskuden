import { Link, type LinkProps } from 'react-router-dom'

type PageLinkProps = LinkProps & {
  children: React.ReactNode
}

/** In-app link; uses View Transitions with RouterProvider (createBrowserRouter). */
export function PageLink({ children, viewTransition = true, ...props }: PageLinkProps) {
  return (
    <Link viewTransition={viewTransition} {...props}>
      {children}
    </Link>
  )
}
