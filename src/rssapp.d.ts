import type { HTMLAttributes } from 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'rssapp-wall': HTMLAttributes<HTMLElement> & {
        id?: string
      }
    }
  }
}
