import { buildContactEmail } from './contact-email'

export interface Env {
  RESEND_API_KEY: string
  CONTACT_TO: string
  CONTACT_FROM?: string
  ALLOWED_ORIGINS?: string
}

type ContactPayload = {
  navn?: string
  email?: string
  telefon?: string
  besked?: string
  website?: string
  _loadedAt?: number
}

const MIN_FORM_MS = 2500
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000

const rateLimit = new Map<string, { count: number; resetAt: number }>()

function getClientIp(request: Request): string {
  return (
    request.headers.get('CF-Connecting-IP') ??
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ??
    'unknown'
  )
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  if (entry.count >= RATE_LIMIT_MAX) return true

  entry.count += 1
  return false
}

function parseAllowedOrigins(value: string | undefined): string[] {
  return (value ?? 'https://kaffeskuden.dk,https://www.kaffeskuden.dk,http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

function corsHeaders(origin: string, allowed: string[]): HeadersInit {
  if (!origin || !allowed.includes(origin)) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}

function json(
  data: unknown,
  status: number,
  origin: string,
  allowed: string[],
): Response {
  return Response.json(data, {
    status,
    headers: corsHeaders(origin, allowed),
  })
}

function validatePayload(body: ContactPayload): string | null {
  const navn = body.navn?.trim() ?? ''
  const email = body.email?.trim() ?? ''
  const besked = body.besked?.trim() ?? ''

  if (!navn) return 'Navn mangler.'
  if (!email) return 'E-mail mangler.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Ugyldig e-mail.'
  if (!besked) return 'Besked mangler.'
  if (navn.length > 200 || email.length > 254 || besked.length > 5000) {
    return 'Beskeden er for lang.'
  }

  const telefon = body.telefon?.trim() ?? ''
  if (telefon.length > 40) return 'Telefonnummeret er for langt.'

  return null
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const allowed = parseAllowedOrigins(env.ALLOWED_ORIGINS)
    const origin = request.headers.get('Origin') ?? ''

    if (request.method === 'OPTIONS') {
      if (!origin || !allowed.includes(origin)) {
        return new Response(null, { status: 403 })
      }
      return new Response(null, { status: 204, headers: corsHeaders(origin, allowed) })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    if (!origin || !allowed.includes(origin)) {
      return new Response('Forbidden', { status: 403 })
    }

    let body: ContactPayload
    try {
      body = (await request.json()) as ContactPayload
    } catch {
      return json({ error: 'Ugyldig forespørgsel.' }, 400, origin, allowed)
    }

    // Honeypot - silently accept so bots do not adapt
    if (body.website?.trim()) {
      return json({ ok: true }, 200, origin, allowed)
    }

    const clientIp = getClientIp(request)
    if (isRateLimited(clientIp)) {
      return json(
        { error: 'For mange forsøg. Prøv igen om en time.' },
        429,
        origin,
        allowed,
      )
    }

    const loadedAt = body._loadedAt
    if (
      typeof loadedAt !== 'number' ||
      !Number.isFinite(loadedAt) ||
      Date.now() - loadedAt < MIN_FORM_MS
    ) {
      return json(
        { error: 'Vent et øjeblik med at sende - så vi ved, at I er rigtige mennesker.' },
        400,
        origin,
        allowed,
      )
    }

    const validationError = validatePayload(body)
    if (validationError) {
      return json({ error: validationError }, 400, origin, allowed)
    }

    const navn = body.navn!.trim()
    const email = body.email!.trim()
    const telefon = body.telefon?.trim() ?? ''
    const besked = body.besked!.trim()

    const from = env.CONTACT_FROM ?? 'Kaffeskuden <kontakt@kaffeskuden.dk>'
    const { text, html } = buildContactEmail({ navn, email, telefon, besked })

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [env.CONTACT_TO],
        reply_to: email,
        subject: `Henvendelse fra ${navn} via kaffeskuden.dk`,
        text,
        html,
      }),
    })

    if (!resendResponse.ok) {
      console.error('Resend error', resendResponse.status, await resendResponse.text())
      return json(
        { error: 'Kunne ikke sende beskeden. Prøv igen om lidt.' },
        502,
        origin,
        allowed,
      )
    }

    return json({ ok: true }, 200, origin, allowed)
  },
}
