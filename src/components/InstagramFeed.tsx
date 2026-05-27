import { useRef } from 'react'
import { useExternalScript } from '../hooks/useExternalScript'
import { useRssAppWallTheme } from '../hooks/useRssAppWallTheme'
import { RSSAPP_WALL_SCRIPT, rssAppWallId } from '../content/instagram'
import './InstagramFeed.css'

const INSTAGRAM_URL = 'https://www.instagram.com/kaffeskuden/'

export function InstagramFeed() {
  const widgetHostRef = useRef<HTMLDivElement>(null)
  const scriptReady = useExternalScript(RSSAPP_WALL_SCRIPT)
  const wallReady = useRssAppWallTheme(widgetHostRef, scriptReady)

  return (
    <section
      id="instagram"
      className="instagram-feed section"
      aria-labelledby="instagram-feed-heading"
    >
      <header className="shell section-head instagram-feed__head">
        <p className="eyebrow">Instagram</p>
        <h2 id="instagram-feed-heading">Fra @kaffeskuden</h2>
        <p>
          Billeder og små historier fra livet på hjul og ude i verden.
        </p>
        <a
          className="instagram-feed__cta"
          href={INSTAGRAM_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          Følg @kaffeskuden
        </a>
      </header>

      <div className="shell instagram-feed__frame">
        <div
          ref={widgetHostRef}
          className={`instagram-feed__widget${wallReady ? ' instagram-feed__widget--ready' : ''}`}
          aria-busy={!wallReady}
        >
          {scriptReady ? (
            <rssapp-wall id={rssAppWallId} />
          ) : (
            <div className="instagram-feed__skeleton" aria-hidden="true">
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className="instagram-feed__skeleton-cell" />
              ))}
            </div>
          )}
          {scriptReady && !wallReady && (
            <div className="instagram-feed__skeleton instagram-feed__skeleton--overlay" aria-hidden="true">
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className="instagram-feed__skeleton-cell" />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
