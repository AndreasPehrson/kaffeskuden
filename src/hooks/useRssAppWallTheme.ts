import { useEffect, useState, type RefObject } from 'react'

const THEME_STYLE_ID = 'kaffeskuden-rss-wall-theme'

/** Overrides RSS.app classic wall cards to match site gallery styling. */
const WALL_THEME_CSS = `
  :host {
    background: transparent !important;
    color: var(--text-h, #0f1114) !important;
  }

  .container-wall-feed,
  .rssapp-wall-container,
  .wall-container {
    display: grid !important;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr)) !important;
    gap: clamp(12px, 2vw, 18px) !important;
    width: 100% !important;
    max-width: none !important;
    background: transparent !important;
  }

  @media (min-width: 900px) {
    .container-wall-feed,
    .rssapp-wall-container,
    .wall-container {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }
  }

  .rssapp-wall-header,
  .wall-header,
  .rssapp-wall-title {
    display: none !important;
  }

  .rssapp-card-container_classic,
  .rssapp-card-container_classic .rssapp-card {
    max-width: none !important;
    width: 100% !important;
    margin: 0 !important;
  }

  .rssapp-card {
    display: flex !important;
    flex-direction: column !important;
    border: 1px solid #e8e6e1 !important;
    border-radius: 8px !important;
    overflow: hidden !important;
    background: #ffffff !important;
    box-shadow: none !important;
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
      box-shadow 0.35s ease !important;
  }

  .rssapp-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(15, 17, 20, 0.08) !important;
  }

  .rssapp-card-body {
    flex: 0 0 auto !important;
    padding: 12px 14px 0 !important;
    order: 2 !important;
  }

  .container-wall-feed > *:nth-child(n + 7) {
    display: none !important;
  }

  .rssapp-powered-by,
  [class*='powered-by'],
  [class*='rssapp-branding'] {
    display: none !important;
  }

  .rssapp-card-title h3,
  .rssapp-card-title a {
    font-family: 'Segoe UI', system-ui, Roboto, sans-serif !important;
    font-size: 0.9rem !important;
    font-weight: 600 !important;
    letter-spacing: -0.02em !important;
    line-height: 1.35 !important;
    color: #0f1114 !important;
    margin: 0 !important;
    text-decoration: none !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
  }

  .rssapp-card-title a:hover {
    color: #1a4d8c !important;
  }

  .rssapp-card-description {
    display: none !important;
  }

  .rssapp-card-footer {
    order: 3 !important;
    padding: 8px 14px 12px !important;
    font-size: 11px !important;
    color: #5c5f66 !important;
    opacity: 0.75 !important;
    border-top: none !important;
  }

  .rssapp-card-image,
  .rssapp-card .rssapp-card-image,
  [class*='rssapp-card-image'],
  .rssapp-card-media {
    order: 1 !important;
    width: 100% !important;
    margin: 0 !important;
  }

  .rssapp-card img,
  .rssapp-card-image img,
  .rssapp-card-media img {
    width: 100% !important;
    height: auto !important;
    aspect-ratio: 1 !important;
    object-fit: cover !important;
    display: block !important;
    border-radius: 0 !important;
  }

  .rssapp-card-image::after,
  .rssapp-card-media::after,
  [class*='card-overlay'],
  [class*='image-overlay'],
  .rssapp-card-gradient {
    display: none !important;
  }

  .rssapp-hostname {
    font-size: 10px !important;
    letter-spacing: 0.04em !important;
    text-transform: uppercase !important;
  }
`

function injectTheme(shadowRoot: ShadowRoot) {
  if (!shadowRoot.getElementById(THEME_STYLE_ID)) {
    const style = document.createElement('style')
    style.id = THEME_STYLE_ID
    style.textContent = WALL_THEME_CSS
    shadowRoot.appendChild(style)
  }

  return Boolean(
    shadowRoot.querySelector('.rssapp-card, .container-wall-feed'),
  )
}

/**
 * Applies Kaffeskuden styling inside the RSS.app wall shadow root once cards mount.
 */
export function useRssAppWallTheme(
  hostRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setReady(false)
      return
    }

    let cancelled = false
    let observer: MutationObserver | undefined
    let timeoutId = 0

    const tryApply = () => {
      if (cancelled) return false

      const wall = hostRef.current?.querySelector('rssapp-wall')
      const shadow = wall?.shadowRoot
      if (!shadow) return false

      const hasContent = injectTheme(shadow)
      if (hasContent) {
        setReady(true)
        return true
      }
      return false
    }

    if (tryApply()) {
      return () => {
        cancelled = true
      }
    }

    observer = new MutationObserver(() => {
      if (tryApply()) observer?.disconnect()
    })

    const host = hostRef.current
    if (host) {
      observer.observe(host, { childList: true, subtree: true })
    }

    let attempts = 0
    const poll = () => {
      if (tryApply()) return
      if (attempts > 40) {
        const wall = hostRef.current?.querySelector('rssapp-wall')
        if (wall?.shadowRoot) injectTheme(wall.shadowRoot)
        setReady(true)
        return
      }
      attempts += 1
      timeoutId = window.setTimeout(poll, 200)
    }
    poll()

    return () => {
      cancelled = true
      observer?.disconnect()
      window.clearTimeout(timeoutId)
    }
  }, [enabled, hostRef])

  return ready
}
