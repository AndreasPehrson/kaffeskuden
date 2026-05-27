import { Link, type LinkProps } from 'react-router-dom'

type PageLinkProps = LinkProps & {
  children: React.ReactNode
}

/** In-app link with View Transitions when the browser supports them. */
export function PageLink({ children, viewTransition = true, ...props }: PageLinkProps) {
  return (
    <Link viewTransition={viewTransition} {...props}>
      {children}
    </Link>
  )
}
