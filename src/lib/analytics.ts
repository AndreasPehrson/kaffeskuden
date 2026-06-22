const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let initialized = false

export function isAnalyticsEnabled(): boolean {
  return Boolean(MEASUREMENT_ID) && import.meta.env.PROD
}

export function initAnalytics(): void {
  if (!isAnalyticsEnabled() || initialized || !MEASUREMENT_ID) return
  initialized = true

  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)
}

/** SPA page view. Include `location.search` on first load so GA4 picks up UTM params. */
export function trackPageView(pagePath: string): void {
  if (!isAnalyticsEnabled() || !window.gtag) return

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_location: `${window.location.origin}${pagePath}`,
    page_title: document.title,
  })
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
): void {
  if (!isAnalyticsEnabled() || !window.gtag) return
  window.gtag('event', name, params)
}
