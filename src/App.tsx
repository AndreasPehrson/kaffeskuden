import { useState, useEffect } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import './App.css'

const NAV_SECTIONS = ['om-os', 'vores-rejser', 'galleri', 'kontakt'] as const

type FormData = {
  navn: string
  email: string
  telefon: string
  besked: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

function App() {
  const [formData, setFormData] = useState<FormData>({
    navn: '',
    email: '',
    telefon: '',
    besked: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] =
    useState<(typeof NAV_SECTIONS)[number]>('om-os')

  useEffect(() => {
    const getHeaderOffset = () => {
      const topbar = document.querySelector('.topbar')
      return (topbar?.getBoundingClientRect().height ?? 120) + 8
    }

    const updateHeader = () => {
      const headerOffset = getHeaderOffset()
      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0

      const hero = document.getElementById('om-os')
      const heroBottom = hero?.getBoundingClientRect().bottom ?? window.innerHeight
      setScrolled(heroBottom <= headerOffset)

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(
        maxScroll > 0 ? Math.min(1, scrollTop / maxScroll) : 0,
      )

      let current: (typeof NAV_SECTIONS)[number] = 'om-os'

      for (const id of NAV_SECTIONS) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= headerOffset) {
          current = id
        }
      }

      const kontakt = document.getElementById('kontakt')
      if (kontakt) {
        const rect = kontakt.getBoundingClientRect()
        const inView = rect.top < window.innerHeight && rect.bottom > headerOffset
        if (inView && rect.top <= window.innerHeight * 0.55) {
          current = 'kontakt'
        }
      }

      if (scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 48) {
        current = 'kontakt'
      }

      setActiveSection(current)
    }

    const onHashChange = () => {
      updateHeader()
      window.setTimeout(updateHeader, 350)
    }

    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    window.addEventListener('resize', updateHeader, { passive: true })
    window.addEventListener('hashchange', onHashChange)
    return () => {
      window.removeEventListener('scroll', updateHeader)
      window.removeEventListener('resize', updateHeader)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    if (isSubmitted) setIsSubmitted(false)
  }

  const validate = () => {
    const nextErrors: FormErrors = {}
    if (!formData.navn.trim()) nextErrors.navn = 'Skriv venligst jeres navn.'
    if (!formData.email.trim()) {
      nextErrors.email = 'Skriv venligst jeres e-mail.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Skriv venligst en gyldig e-mail.'
    }
    if (!formData.besked.trim()) nextErrors.besked = 'Skriv kort om jeres arrangement.'
    return nextErrors
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 700))
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({
      navn: '',
      email: '',
      telefon: '',
      besked: '',
    })
  }

  return (
    <div className="page">
      <header
        className={`topbar${scrolled ? ' topbar--scrolled' : ''}`}
        data-scrolled={scrolled}
      >
        <a className="brand" href="#om-os" aria-label="Kaffeskuden hjem">
          <img src="/logo.jpg" alt="Kaffeskuden logo" />
          <span>Kaffeskuden</span>
        </a>
        <nav aria-label="Primær navigation">
          <a
            href="#vores-rejser"
            className={
              scrolled && activeSection === 'vores-rejser' ? 'is-active' : ''
            }
            aria-current={activeSection === 'vores-rejser' ? 'page' : undefined}
          >
            Vores rejser
          </a>
          <a
            href="#galleri"
            className={scrolled && activeSection === 'galleri' ? 'is-active' : ''}
            aria-current={activeSection === 'galleri' ? 'page' : undefined}
          >
            Galleri
          </a>
          <a
            href="#kontakt"
            className={activeSection === 'kontakt' ? 'is-active' : ''}
            aria-current={activeSection === 'kontakt' ? 'page' : undefined}
            onClick={() => {
              window.setTimeout(() => setActiveSection('kontakt'), 400)
            }}
          >
            Kontakt
          </a>
        </nav>
        <a
          className="topbar-cta"
          href="#kontakt"
          onClick={() => {
            window.setTimeout(() => setActiveSection('kontakt'), 400)
          }}
        >
          Book nu
        </a>
        <span
          className="topbar-progress"
          style={{ '--progress': scrollProgress } as CSSProperties}
          aria-hidden="true"
        />
      </header>

      <main id="indhold">
      <section className="hero-full" id="om-os">
        <div className="hero-media" aria-hidden="true">
          <img src="/hero.jpg" alt="" />
          <div className="hero-scrim" />
        </div>
        <div className="shell hero-copy">
          <p className="tag">Rullende kaffebar</p>
          <h1>Kvalitetskaffe på hjul til events med ro og stærk smag.</h1>
          <p className="lead">
            Vi ruller ud med espressomaskine, dygtige baristaer og nøje udvalgte
            bønner til firmaevents, markeder og private fester. Vi kaffes ved.
          </p>
          <div className="hero-actions">
            <a className="cta" href="#kontakt">
              Book Kaffeskuden
            </a>
            <a className="ghost" href="#galleri">
              Se stemningen
            </a>
          </div>
        </div>
      </section>

      <section id="vores-rejser" className="section">
        <div className="shell story-split">
          <img
            src="/bønner.jpg"
            alt="Udvalgte kaffebønner"
            className="story-image"
          />
          <div>
            <div className="section-head">
              <p className="eyebrow">Vores rejser</p>
              <h2>Fra farm til kop</h2>
              <p>
                Vi udvælger bønner med fokus på smag, sporbarhed og ansvarlig handel.
              </p>
            </div>
            <div className="story-grid">
              <article>
                <span>01</span>
                <h3>Udvælgelse</h3>
                <p>
                  Vi cupping-smager løbende og vælger lotter med balance, sødme og
                  karakter.
                </p>
              </article>
              <article>
                <span>02</span>
                <h3>Relationer</h3>
                <p>
                  Langvarige partnerskaber med producenter og risterier — fair for
                  alle led.
                </p>
              </article>
              <article>
                <span>03</span>
                <h3>Servering</h3>
                <p>
                  På skuden brygger vi med samme respekt for råvaren, som da bønnerne
                  blev udvalgt.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="galleri" className="section section-gallery">
        <div className="section-head">
          <p className="eyebrow">Galleri</p>
          <h2>Skuden, stemningen og baristaerne</h2>
        </div>
        <div className="photo-mosaic">
          <img
            src="/skuden.jpg"
            alt="Kaffeskuden på lokation"
            className="tile-a"
          />
          <img
            src="/stemning3.jpg"
            alt="Servering i eventmiljø"
            className="tile-b"
          />
          <img
            src="/niclas.jpg"
            alt="Barista ved Kaffeskuden"
            className="tile-c"
          />
          <img
            src="/stemning.jpg"
            alt="Kaffestemning ved servering"
            className="tile-d"
          />
          <img
            src="/stemning2.jpg"
            alt="Kunder ved kaffebaren"
            className="tile-e"
          />
          <img
            src="/test-smagning.jpg"
            alt="Smagning af kaffe"
            className="tile-f"
          />
        </div>
      </section>

      <section className="section event-section">
        <div className="shell">
          <div className="section-head">
            <p className="eyebrow">Eventtyper</p>
            <h2>Vi matcher formatet til jeres dag</h2>
          </div>
          <div className="event-grid">
            <article>
              <h3>Firmaevents</h3>
              <p>Pop-up kaffebar til konferencer, kontordage og messer.</p>
            </article>
            <article>
              <h3>Private fester</h3>
              <p>Baristaoplevelse til bryllup, reception og store fejringer.</p>
            </article>
            <article>
              <h3>Byliv og markeder</h3>
              <p>Rullende kaffe med god energi til offentlige events.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="kontakt" className="section contact">
        <div className="shell contact-inner">
          <p className="eyebrow">Kontakt</p>
          <h2>Skal vi rulle ud til jer?</h2>
          <p>
            Fortæl os om dato, lokation og antal gæster — så sender vi et tilbud.
          </p>
          <div className="contact-stack">
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="field-row">
                <label>
                  Navn *
                  <input
                    type="text"
                    value={formData.navn}
                    onChange={(event) => handleChange('navn', event.target.value)}
                    aria-invalid={Boolean(errors.navn)}
                    placeholder="Fx. Mette Hansen"
                    autoComplete="name"
                  />
                  {errors.navn && <span className="field-error">{errors.navn}</span>}
                </label>
                <label>
                  E-mail *
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => handleChange('email', event.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    placeholder="fx. booking@firma.dk"
                    autoComplete="email"
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </label>
              </div>
              <label>
                Telefon <span className="field-optional">valgfrit</span>
                <input
                  type="tel"
                  value={formData.telefon}
                  onChange={(event) => handleChange('telefon', event.target.value)}
                  placeholder="+45 61 78 67 79"
                  autoComplete="tel"
                />
              </label>
              <label>
                Besked *
                <textarea
                  rows={5}
                  value={formData.besked}
                  onChange={(event) => handleChange('besked', event.target.value)}
                  aria-invalid={Boolean(errors.besked)}
                  placeholder="Fortæl kort om event, dato, lokation og antal gæster..."
                />
                {errors.besked && <span className="field-error">{errors.besked}</span>}
              </label>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sender...' : 'Send forespørgsel'}
              </button>
              {isSubmitted && (
                <p className="form-success" role="status">
                  Tak! Vi har modtaget jeres forespørgsel og vender tilbage hurtigst muligt.
                </p>
              )}
            </form>
            <div className="contact-alt">
              <p className="contact-alt-label">Eller skriv direkte</p>
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
            <p>© {new Date().getFullYear()} Kaffeskuden — rullende kaffebar til events i Danmark.</p>
          </div>
        </footer>
      </section>
      </main>
    </div>
  )
}

export default App
