/** View Transitions need createBrowserRouter + Link viewTransition (not BrowserRouter). */
export function supportsViewTransitions() {
  if (typeof document === 'undefined') return false
  if (!('startViewTransition' in document)) return false
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
