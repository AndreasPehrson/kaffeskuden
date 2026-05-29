import { useRef } from 'react'
import { images } from '../content/assets'
import { ContactForm } from '../components/ContactForm'
import { EventTypesSection } from '../components/EventTypesSection'
import { PageLink } from '../components/PageLink'
import { PictureImage } from '../PictureImage'
import { useHeroParallax } from '../hooks/useHeroParallax'
import './journeys.css'

export function HomePage() {
  const heroRef = useRef<HTMLElement>(null)
  const heroLayerRef = useRef<HTMLDivElement>(null)
  useHeroParallax(heroRef, heroLayerRef)

  return (
    <main id="indhold">
      <section className="hero-full" id="om-os" ref={heroRef}>
        <div className="hero-media">
          <div className="hero-media__layer" ref={heroLayerRef}>
            <PictureImage
              src={images.hero}
              alt="Kaffeskuden serverer espresso ved et udendørs event"
              loading="eager"
              fetchPriority="high"
            />
            <div className="hero-scrim" />
          </div>
        </div>
        <div className="shell hero-copy">
          <p className="tag">Kaffe på hjul</p>
          <h1>God kaffe. Roligt tempo.</h1>
          <p className="lead">
            Vi kører ud med espresso, baristaer der kan deres craft, og bønner vi
            selv vil drikke. Kontor, messe eller fest - I skal bare have en kop,
            der smager ordentligt.
          </p>
          <div className="hero-actions">
            <PageLink className="cta" to="/#kontakt">
              Skriv til os
            </PageLink>
            <PageLink className="ghost" to="/vores-rejser">
              Vores rejser
            </PageLink>
          </div>
        </div>
      </section>

      <section className="section journeys-teaser" aria-labelledby="journeys-teaser-heading">
        <div className="shell journeys-teaser__grid">
          <div>
            <p className="eyebrow">Vores rejser</p>
            <h2 id="journeys-teaser-heading">Der hvor bønnerne vokser</h2>
            <p>
              Vi besøger farme og risterier, smager os frem og tager kun det med
              hjem, vi har lyst til at servere. Det skriver vi ned undervejs - ét
              kapitel ad gangen.
            </p>
            <PageLink className="link-arrow" to="/vores-rejser">
              Se, hvad vi har set
            </PageLink>
          </div>
          <PictureImage
            src={images.beans}
            alt="Udvalgte kaffebønner"
            className="journeys-teaser__image"
          />
        </div>
      </section>

      <EventTypesSection />

      <div className="contact-block">
        <section id="kontakt" className="section contact">
          <div className="shell contact-inner">
            <p className="eyebrow">Kontakt</p>
            <h2>Skal vi køre forbi?</h2>
            <p>
              Næste uge eller næste sommer - begge dele er fine. Skriv, så tager vi
              en snak.
            </p>
            <div className="contact-stack">
              <ContactForm />
            </div>
          </div>
        </section>

        <footer className="site-footer site-footer--contact">
          <div className="shell">
            <p>© {new Date().getFullYear()} Kaffeskuden - kaffe på hjul i Danmark.</p>
          </div>
        </footer>
      </div>
    </main>
  )
}
