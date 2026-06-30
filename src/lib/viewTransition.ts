function isMobileOrTouchBrowser() {
  if (window.matchMedia('(max-width: 900px)').matches) return true
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return true

  // iOS / iPadOS Safari (incl. iPad “desktop” mode)
  const ua = navigator.userAgent
  if (/iPad|iPhone|iPod/i.test(ua)) return true
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true

  return false
}

/** View Transitions need createBrowserRouter + Link viewTransition (not BrowserRouter). */
export function supportsViewTransitions() {
  if (typeof document === 'undefined') return false
  if (!('startViewTransition' in document)) return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  // Blur + image snapshots often crash mobile WebKit/Chrome (“repeated problems” tab kill).
  if (isMobileOrTouchBrowser()) return false
  return true
}
