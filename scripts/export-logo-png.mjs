/**
 * Export Kaffeskuden logo as PNG with transparent background (no white matte).
 * Does not change what the site uses (still logo.jpg in the header).
 *
 * Run: npm run export-logo
 *
 * Only the outer white JPEG border is removed; white inside the logo is kept.
 *
 * Source priority (first file that exists):
 *   public/brand/logo-master.png | logo-master.jpg - use this for print/slides (1024px+ recommended)
 *   public/brand/logo.jpg
 *
 * Outputs (only at or below source resolution - no fake upscales):
 *   kaffeskuden-logo-transparent.png
 *   kaffeskuden-logo-transparent-512.png - only if source width ≥ 512
 *   kaffeskuden-logo-transparent-1024.png - only if source width ≥ 1024
 */

import { readFile, writeFile, access, unlink } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { applyOuterMatteTransparency } from './lib/logo-outer-matte.mjs'

const brandDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'brand')

const SOURCE_CANDIDATES = [
  'logo-master.png',
  'logo-master.jpg',
  'logo-master.jpeg',
  'logo.jpg',
]

const STALE_UPSCALES = [
  'kaffeskuden-logo-transparent-512.png',
  'kaffeskuden-logo-transparent-1024.png',
]

async function resolveSource() {
  for (const name of SOURCE_CANDIDATES) {
    const path = join(brandDir, name)
    try {
      await access(path)
      const meta = await sharp(path).metadata()
      return { path, name, width: meta.width ?? 0 }
    } catch {
      // try next
    }
  }
  return null
}

async function exportLogo(inputPath, size, outputName) {
  const inputBuf = await readFile(inputPath)

  let pipeline = sharp(inputBuf)
  if (size) {
    pipeline = pipeline.resize(size, size, {
      fit: 'contain',
      kernel: sharp.kernel.lanczos3,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
      withoutEnlargement: true,
    })
  }

  const { data, info } = await pipeline.ensureAlpha().raw().toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  const pixels = Buffer.from(data)

  applyOuterMatteTransparency(pixels, width, height, channels)

  const trimmed = await sharp(pixels, { raw: { width, height, channels } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .trim({ threshold: 1 })
    .toBuffer()

  const outputPath = join(brandDir, outputName)
  await writeFile(outputPath, trimmed)

  const meta = await sharp(trimmed).metadata()
  console.log(`Wrote ${outputPath} (${trimmed.length} bytes, ${meta.width}×${meta.height})`)
  return meta.width ?? size
}

const source = await resolveSource()
if (!source) {
  console.error('Missing logo source. Add public/brand/logo.jpg or logo-master.png (1024px+).')
  process.exit(1)
}

const { path: inputPath, name: sourceName, width: sourceWidth } = source

console.log(`Source: ${sourceName} (${sourceWidth}×${sourceWidth}px)`)

await exportLogo(inputPath, null, 'kaffeskuden-logo-transparent.png')

if (sourceWidth >= 512) {
  await exportLogo(inputPath, 512, 'kaffeskuden-logo-transparent-512.png')
} else {
  for (const name of STALE_UPSCALES.filter((n) => n.includes('512'))) {
    try {
      await unlink(join(brandDir, name))
      console.log(`Removed stale upscale: ${name} (source is only ${sourceWidth}px)`)
    } catch {
      // already gone
    }
  }
}

if (sourceWidth >= 1024) {
  await exportLogo(inputPath, 1024, 'kaffeskuden-logo-transparent-1024.png')
} else {
  for (const name of STALE_UPSCALES.filter((n) => n.includes('1024'))) {
    try {
      await unlink(join(brandDir, name))
      console.log(`Removed stale upscale: ${name} (source is only ${sourceWidth}px)`)
    } catch {
      // already gone
    }
  }
}

if (sourceWidth < 512) {
  console.log(
    `\n${sourceWidth}px is the maximum detail available. For sharp slides/print, add public/brand/logo-master.png at 1024px or larger (export from your original design file), then run npm run export-logo again.`,
  )
}
