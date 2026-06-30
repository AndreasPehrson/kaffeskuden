/**
 * Add DMARC TXT record for kaffeskuden.dk in Cloudflare.
 * Requires: CLOUDFLARE_API_TOKEN with Zone.DNS Edit for kaffeskuden.dk
 *
 * Create token: https://dash.cloudflare.com/profile/api-tokens
 * Template: "Edit zone DNS" → zone: kaffeskuden.dk
 *
 * Usage: CLOUDFLARE_API_TOKEN=xxx node scripts/add-dmarc-dns.mjs
 */

const ZONE_NAME = 'kaffeskuden.dk'
const RECORD_NAME = '_dmarc'
const RECORD_CONTENT = 'v=DMARC1; p=none;'

const token = process.env.CLOUDFLARE_API_TOKEN?.trim()
if (!token) {
  console.error('Set CLOUDFLARE_API_TOKEN (Zone DNS Edit for kaffeskuden.dk).')
  process.exit(1)
}

const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
}

async function api(path, options = {}) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  })
  const data = await res.json()
  if (!data.success) {
    throw new Error(JSON.stringify(data.errors ?? data))
  }
  return data
}

const zones = await api(`/zones?name=${ZONE_NAME}`)
const zoneId = zones.result[0]?.id
if (!zoneId) {
  console.error(`Zone not found: ${ZONE_NAME}`)
  process.exit(1)
}

const existing = await api(
  `/zones/${zoneId}/dns_records?type=TXT&name=${RECORD_NAME}.${ZONE_NAME}`,
)

if (existing.result.length > 0) {
  const record = existing.result[0]
  if (record.content === RECORD_CONTENT) {
    console.log('DMARC record already exists and matches.')
    process.exit(0)
  }

  await api(`/zones/${zoneId}/dns_records/${record.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ content: RECORD_CONTENT, ttl: 1 }),
  })
  console.log('Updated existing DMARC record.')
  process.exit(0)
}

await api(`/zones/${zoneId}/dns_records`, {
  method: 'POST',
  body: JSON.stringify({
    type: 'TXT',
    name: RECORD_NAME,
    content: RECORD_CONTENT,
    ttl: 1,
  }),
})

console.log('Added DMARC TXT record for', ZONE_NAME)
