import { useState } from 'react'
import type { FormEvent } from 'react'
import './ContactForm.css'

type FormData = {
  navn: string
  email: string
  telefon: string
  besked: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

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
          Dato, sted og cirka hvor mange I er — så vender vi tilbage med et forslag.
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
              placeholder="Fx. Mette"
              autoComplete="name"
            />
            {errors.navn && <span className="contact-form__error">{errors.navn}</span>}
          </label>
          <label className="contact-form__field">
            <span className="contact-form__label">E-mail *</span>
            <input
              type="email"
              value={formData.email}
              onChange={(event) => handleChange('email', event.target.value)}
              aria-invalid={Boolean(errors.email)}
              placeholder="fx. hej@firma.dk"
              autoComplete="email"
            />
            {errors.email && <span className="contact-form__error">{errors.email}</span>}
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
            placeholder="Hvad skal vi stille med? Bryllup, messe, havefest…"
          />
          {errors.besked && <span className="contact-form__error">{errors.besked}</span>}
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
          Tak for beskeden — vi vender tilbage, så snart vi har kigget på den.
        </p>
      )}

      <footer className="contact-form__footer">
        <p className="contact-form__footer-label">Eller kontakt os direkte</p>
        <div className="contact-form__channels">
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
      </footer>
    </form>
  )
}
