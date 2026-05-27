import { useEffect, useState } from 'react'

/**
 * Loads an external script once per URL and reports when it is ready.
 */
export function useExternalScript(src: string) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!src) return

    const markReady = () => setReady(true)
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    )

    if (existing) {
      if (existing.dataset.loaded === 'true') {
        markReady()
      } else {
        existing.addEventListener('load', markReady)
        return () => existing.removeEventListener('load', markReady)
      }
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.type = 'text/javascript'
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true'
      markReady()
    })
    document.body.appendChild(script)

    return () => {
      script.removeEventListener('load', markReady)
    }
  }, [src])

  return ready
}
