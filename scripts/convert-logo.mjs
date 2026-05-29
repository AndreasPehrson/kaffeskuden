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
import { applyOuterMatteTransparency } from './lib/logo-outer-matte.mjs'

const brandDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'brand')
const inputPath = join(brandDir, 'logo.jpg')

try {
  await access(inputPath)
} catch {
  console.error('Missing public/brand/logo.jpg — add the source JPEG first.')
  process.exit(1)
}

const inputBuf = await readFile(inputPath)

const { data, info } = await sharp(inputBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })

const { width, height, channels } = info
const pixels = Buffer.from(data)

applyOuterMatteTransparency(pixels, width, height, channels)

const outputPath = join(brandDir, 'logo.png')
const pngBuf = await sharp(pixels, { raw: { width, height, channels } })
  .png({ compressionLevel: 9 })
  .toBuffer()

await writeFile(outputPath, pngBuf)
console.log(`Wrote ${outputPath} (${pngBuf.length} bytes). logo.jpg is unchanged.`)
