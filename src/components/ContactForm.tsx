import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import './ContactForm.css'

type FormData = {
  navn: string
  email: string
  telefon: string
  besked: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

function ContactIcon({ children }: { children: ReactNode }) {
  return <span className="contact-form__channel-icon">{children}</span>
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6.5h16a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 16V8A1.5 1.5 0 0 1 4 6.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="m3.5 8 8.2 5.4a1 1 0 0 0 1.1 0L21.5 8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8.5 4.8c.4-1 1.6-1.3 2.5-.7l1.4.9c.8.5 1 1.5.6 2.3l-.8 1.6a12.5 12.5 0 0 0 5.2 5.2l1.6-.8c.8-.4 1.8-.2 2.3.6l.9 1.4c.6.9.3 2.1-.7 2.5-1.2.5-2.5.8-3.8.8-6.1 0-11-4.9-11-11 0-1.3.3-2.6.8-3.8Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  )
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    navn: '',
    email: '',
    telefon: '',
    besked: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    if (isSubmitted) setIsSubmitted(false)
  }

  const validate = () => {
    const nextErrors: FormErrors = {}
    if (!formData.navn.trim()) nextErrors.navn = 'Hvad hedder I?'
    if (!formData.email.trim()) {
      nextErrors.email = 'Vi skal bruge en e-mail.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Den e-mail ser ikke helt rigtig ud.'
    }
    if (!formData.besked.trim()) nextErrors.besked = 'Fortæl lidt om jeres arrangement.'
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
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <header className="contact-form__head">
        <h3 className="contact-form__title">Fortæl os om jeres dag</h3>
        <p className="contact-form__lead">
          Dato, sted og cirka hvor mange I er. Så vender vi tilbage - typisk inden for
          et par dage.
        </p>
      </header>

      <div className="contact-form__fields">
        <div className="contact-form__row">
          <label className="contact-form__field">
            <span className="contact-form__label">Navn *</span>
            <input
              type="text"
              value={formData.navn}
              onChange={(event) => handleChange('navn', event.target.value)}
              aria-invalid={Boolean(errors.navn)}
              aria-describedby={errors.navn ? 'navn-error' : undefined}
              placeholder="Fx. Mette"
              autoComplete="name"
            />
            {errors.navn && (
              <span id="navn-error" className="contact-form__error">
                {errors.navn}
              </span>
            )}
          </label>
          <label className="contact-form__field">
            <span className="contact-form__label">E-mail *</span>
            <input
              type="email"
              value={formData.email}
              onChange={(event) => handleChange('email', event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              placeholder="fx. hej@firma.dk"
              autoComplete="email"
            />
            {errors.email && (
              <span id="email-error" className="contact-form__error">
                {errors.email}
              </span>
            )}
          </label>
        </div>

        <label className="contact-form__field">
          <span className="contact-form__label">
            Telefon <span className="contact-form__optional">valgfrit</span>
          </span>
          <input
            type="tel"
            value={formData.telefon}
            onChange={(event) => handleChange('telefon', event.target.value)}
            placeholder="+45 61 78 67 79"
            autoComplete="tel"
          />
        </label>

        <label className="contact-form__field">
          <span className="contact-form__label">Besked *</span>
          <textarea
            rows={4}
            value={formData.besked}
            onChange={(event) => handleChange('besked', event.target.value)}
            aria-invalid={Boolean(errors.besked)}
            aria-describedby={errors.besked ? 'besked-error' : undefined}
            placeholder="Hvad skal vi stille med? Bryllup, messe, havefest, eller noget helt fjerde…"
          />
          {errors.besked && (
            <span id="besked-error" className="contact-form__error">
              {errors.besked}
            </span>
          )}
        </label>
      </div>

      <button type="submit" className="contact-form__submit" disabled={isSubmitting}>
        <span>{isSubmitting ? 'Sender…' : 'Send besked'}</span>
        {!isSubmitting && (
          <span className="contact-form__submit-arrow" aria-hidden="true">
            →
          </span>
        )}
      </button>

      {isSubmitted && (
        <p className="contact-form__success" role="status">
          Tak - vi har fået den. Vi skriver tilbage, så snart vi har kigget på det.
        </p>
      )}

      <footer className="contact-form__footer">
        <p className="contact-form__footer-label">Eller kontakt os direkte</p>
        <div className="contact-form__channels">
          <a href="mailto:hej@kaffeskuden.dk">
            <ContactIcon>
              <MailIcon />
            </ContactIcon>
            hej@kaffeskuden.dk
          </a>
          <a href="tel:+4561786779">
            <ContactIcon>
              <PhoneIcon />
            </ContactIcon>
            +45 61 78 67 79
          </a>
          <a
            href="https://www.instagram.com/kaffeskuden/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <ContactIcon>
              <InstagramIcon />
            </ContactIcon>
            Instagram
          </a>
        </div>
      </footer>
    </form>
  )
}
