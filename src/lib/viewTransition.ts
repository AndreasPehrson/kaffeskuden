/** View Transitions need createBrowserRouter + Link viewTransition (not BrowserRouter). */
export function supportsViewTransitions() {
  if (typeof document === 'undefined') return false
  if (!('startViewTransition' in document)) return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  // Blur + large image snapshots often crash mobile Chrome ("repeated problems" tab kill).
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return false
  return true
}
