/**
 * Generate a scannable QR code with the Kaffeskuden logo centered.
 *
 * Run:
 *   npm run generate-qr
 *   QR_URL=https://kaffeskuden.dk/?utm_source=qr npm run generate-qr
 *
 * Output: public/brand/kaffeskuden-qr.png (1024px, print-friendly)
 */

import { writeFile, access } from 'node:fs/promises'
import { constants } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const brandDir = join(root, 'public', 'brand')

const url = process.env.QR_URL?.trim() || 'https://kaffeskuden.dk/?utm_source=qr'
const size = Number(process.env.QR_SIZE) || 1024
const logoScale = Number(process.env.QR_LOGO_SCALE) || 0.2
const dark = process.env.QR_COLOR_DARK || '#0f1114'
const light = process.env.QR_COLOR_LIGHT || '#ffffff'

const logoPath = join(brandDir, 'kaffeskuden-logo-transparent.png')
const outputPath = join(brandDir, 'kaffeskuden-qr.png')

await access(logoPath, constants.R_OK)

const qrBuffer = await QRCode.toBuffer(url, {
  type: 'png',
  width: size,
  margin: 2,
  errorCorrectionLevel: 'H',
  color: { dark, light },
})

const logoSize = Math.round(size * logoScale)
const padSize = Math.round(logoSize * 1.18)
const offset = Math.round((size - padSize) / 2)
const logoOffset = offset + Math.round((padSize - logoSize) / 2)
const radius = Math.round(padSize * 0.22)

const padSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${padSize}" height="${padSize}">
    <rect width="${padSize}" height="${padSize}" rx="${radius}" fill="${light}"/>
  </svg>`,
)

const padBuffer = await sharp(padSvg).png().toBuffer()
const logoBuffer = await sharp(logoPath).resize(logoSize, logoSize, { fit: 'contain' }).png().toBuffer()

const output = await sharp(qrBuffer)
  .composite([
    { input: padBuffer, left: offset, top: offset },
    { input: logoBuffer, left: logoOffset, top: logoOffset },
  ])
  .png()
  .toBuffer()

await writeFile(outputPath, output)

console.log(`Wrote ${outputPath}`)
console.log(`URL: ${url}`)
console.log(`Size: ${size}px · logo ~${Math.round(logoScale * 100)}% · error correction: H`)
