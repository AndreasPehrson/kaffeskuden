/**
 * Optional: build brand/logo.png with transparent background from logo.jpg.
 * The site uses logo.jpg by default (sharper at header size).
 *
 * Run: npm run convert-logo
 */

import { readFile, writeFile, access } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const brandDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'brand')
const inputPath = join(brandDir, 'logo.jpg')

try {
  await access(inputPath)
} catch {
  console.error('Missing public/brand/logo.jpg — add the source JPEG first.')
  process.exit(1)
}

function shouldBeTransparent(r, g, b) {
  const lum = 0.299 * r + 0.587 * g + 0.114 * b
  if (lum >= 228) return true
  if (r >= 220 && g >= 220 && b >= 220) return true
  return false
}

const inputBuf = await readFile(inputPath)

const { data, info } = await sharp(inputBuf)
  .resize(300, 300, {
    fit: 'contain',
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height, channels } = info
const pixels = Buffer.from(data)

for (let i = 0; i < pixels.length; i += channels) {
  if (shouldBeTransparent(pixels[i], pixels[i + 1], pixels[i + 2])) {
    pixels[i + 3] = 0
  }
}

const outputPath = join(brandDir, 'logo.png')
const pngBuf = await sharp(pixels, { raw: { width, height, channels } })
  .png({ compressionLevel: 9 })
  .toBuffer()

await writeFile(outputPath, pngBuf)
console.log(`Wrote ${outputPath} (${pngBuf.length} bytes). logo.jpg is unchanged.`)
