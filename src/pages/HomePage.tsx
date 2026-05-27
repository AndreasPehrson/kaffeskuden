import { images } from '../content/assets'
import { ContactForm } from '../components/ContactForm'
import { EventTypesSection } from '../components/EventTypesSection'
import { PageLink } from '../components/PageLink'
import { PictureImage } from '../PictureImage'

export function HomePage() {
  return (
    <main id="indhold">
      <section className="hero-full" id="om-os">
        <div className="hero-media">
          <PictureImage
            src={images.hero}
            alt="Kaffeskuden serverer espresso ved et udendørs event"
            loading="eager"
            fetchPriority="high"
          />
          <div className="hero-scrim" />
        </div>
        <div className="shell hero-copy">
          <p className="tag">Kaffe på hjul</p>
          <h1>God kaffe. Roligt tempo.</h1>
          <p className="lead">
            Vi kører ud med espresso, baristaer og bønner, vi selv kan lide. Til
            arbejdsdag, marked eller fest - I skal bare have en god kop.
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
            <h2 id="journeys-teaser-heading">Der hvor bønnerne kommer fra</h2>
            <p>
              Vi rejser ikke for at poste kort. Vi rejser for at finde bønner, vi
              gider brygge på - og for at fortælle jer om det, uden at gøre det
              større end det er.
            </p>
            <PageLink className="link-arrow" to="/vores-rejser">
              Læs om vores rejser
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

      <section id="kontakt" className="section contact">
        <div className="shell contact-inner">
          <p className="eyebrow">Kontakt</p>
          <h2>Skal vi køre forbi?</h2>
          <p>
            Skriv dato, sted og cirka hvor mange I er. Så finder vi ud af resten
            sammen.
          </p>
          <div className="contact-stack">
            <ContactForm />
            <div className="contact-alt">
              <p className="contact-alt-label">Eller bare ring eller skriv</p>
              <div className="contact-links">
                <a href="mailto:hej@kaffeskuden.dk">hej@kaffeskuden.dk</a>
                <a href="tel:+4561786779">+45 61 78 67 79</a>
                <a
                  href="https://www.instagram.com/kaffeskuden/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        <footer className="site-footer">
          <div className="shell">
            <p>© {new Date().getFullYear()} Kaffeskuden - kaffe på hjul i Danmark.</p>
          </div>
        </footer>
      </section>
    </main>
  )
}
