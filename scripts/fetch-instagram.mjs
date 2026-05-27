/**
 * Fetch recent Instagram posts via Graph API and save for the static site.
 *
 * Requires: INSTAGRAM_ACCESS_TOKEN in .env or environment
 * Optional: INSTAGRAM_USER_ID (defaults to /me)
 *
 * See docs/INSTAGRAM.md
 */

import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'images', 'instagram')
const manifestPath = join(root, 'src', 'content', 'instagram-feed.json')
const API_VERSION = 'v21.0'
const LIMIT = Number(process.env.INSTAGRAM_FETCH_LIMIT || 12)

async function loadEnvFile() {
  try {
    const raw = await readFile(join(root, '.env'), 'utf8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
      if (!process.env[key]) process.env[key] = value
    }
  } catch {
    /* no .env */
  }
}

async function apiGet(path, token) {
  const url = new URL(`https://graph.instagram.com/${API_VERSION}/${path}`)
  url.searchParams.set('access_token', token)
  const res = await fetch(url)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error?.message || `Instagram API ${res.status}`)
  }
  return data
}

async function downloadFile(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`)
  await pipeline(res.body, createWriteStream(dest))
}

function pickImageUrl(media) {
  if (media.media_type === 'VIDEO') {
    return media.thumbnail_url || media.media_url
  }
  return media.media_url
}

async function main() {
  await loadEnvFile()
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!token) {
    console.error('Missing INSTAGRAM_ACCESS_TOKEN. See docs/INSTAGRAM.md')
    process.exit(1)
  }

  let userId = process.env.INSTAGRAM_USER_ID
  let username = 'kaffeskuden'

  if (!userId) {
    const me = await apiGet('me?fields=id,username', token)
    userId = me.id
    username = me.username || username
  }

  const list = await apiGet(
    `${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${LIMIT}`,
    token,
  )

  await mkdir(outDir, { recursive: true })

  const posts = []

  for (const item of list.data || []) {
    let imageUrl = pickImageUrl(item)
    let mediaId = item.id

    if (item.media_type === 'CAROUSEL_ALBUM') {
      const children = await apiGet(
        `${item.id}/children?fields=id,media_type,media_url,thumbnail_url`,
        token,
      )
      const first = children.data?.[0]
      if (first) {
        imageUrl = pickImageUrl(first)
        mediaId = first.id
      }
    }

    if (!imageUrl) continue

    const filename = `${mediaId}.jpg`
    const localPath = `/images/instagram/${filename}`
    const dest = join(outDir, filename)

    try {
      await downloadFile(imageUrl, dest)
    } catch (error) {
      console.warn(`  Skip ${item.id}: ${error.message}`)
      continue
    }

    posts.push({
      id: item.id,
      caption: (item.caption || '').slice(0, 280),
      permalink: item.permalink,
      timestamp: item.timestamp,
      mediaType: item.media_type,
      image: localPath,
    })
  }

  const manifest = {
    updatedAt: new Date().toISOString(),
    username,
    posts,
  }

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  console.log(`Saved ${posts.length} posts → ${manifestPath}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
