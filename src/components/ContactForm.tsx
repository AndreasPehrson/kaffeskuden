import { useState } from 'react'
import type { FormEvent } from 'react'

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
      <div className="field-row">
        <label>
          Navn *
          <input
            type="text"
            value={formData.navn}
            onChange={(event) => handleChange('navn', event.target.value)}
            aria-invalid={Boolean(errors.navn)}
            placeholder="Fx. Mette"
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
            placeholder="fx. hej@firma.dk"
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
          placeholder="Dato, sted, antal gæster - og hvad I tænker..."
        />
        {errors.besked && <span className="field-error">{errors.besked}</span>}
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sender...' : 'Send besked'}
      </button>
      <p className="contact-privacy">
        Vi bruger kun det, I skriver, til at svare jer. Skriv til{' '}
        <a href="mailto:hej@kaffeskuden.dk">hej@kaffeskuden.dk</a>, hvis I vil have indsigt
        eller sletning.
      </p>
      {isSubmitted && (
        <p className="form-success" role="status">
          Tak for beskeden - vi skriver, når vi har set på den.
        </p>
      )}
    </form>
  )
}
