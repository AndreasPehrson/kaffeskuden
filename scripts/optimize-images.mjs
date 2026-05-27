/**
 * Compress JPEGs and write WebP siblings when smaller.
 * Scans: public/images/, public/brand/
 * Icons: resizes public/icons/favicon.png
 *
 * Run: npm run optimize-images
 */

import { readdir, readFile, stat, writeFile, mkdir, unlink } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')
const imageDirs = ['images', 'images/instagram', 'brand']
const MAX_WIDTH = 1920
const JPEG_QUALITY = 82

async function writeWebpSibling(pipeline, webpPath, jpegSize) {
  for (const quality of [82, 75, 68, 62]) {
    const webpBuf = await pipeline.clone().webp({ quality, effort: 4 }).toBuffer()
    if (webpBuf.length < jpegSize) {
      await writeFile(webpPath, webpBuf)
      return { bytes: webpBuf.length, quality }
    }
  }

  try {
    await unlink(webpPath)
  } catch {
    /* no stale file */
  }

  return null
}

async function optimizeJpegInDir(dirName) {
  const dirPath = join(publicDir, dirName)
  const results = []

  let files
  try {
    files = await readdir(dirPath)
  } catch {
    return results
  }

  for (const filename of files) {
    if (!/\.jpe?g$/i.test(filename)) continue

    const inputPath = join(dirPath, filename)
    const webpPath = join(dirPath, filename.replace(/\.jpe?g$/i, '.webp'))

    try {
      const before = (await stat(inputPath)).size
      const inputBuf = await readFile(inputPath)

      const pipeline = sharp(inputBuf, { failOn: 'none' }).rotate().resize({
        width: MAX_WIDTH,
        withoutEnlargement: true,
      })

      const jpegBuf = await pipeline
        .clone()
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
        .toBuffer()
      await writeFile(inputPath, jpegBuf)

      const webp = await writeWebpSibling(pipeline, webpPath, jpegBuf.length)
      const webpNote = webp
        ? `${webp.bytes} bytes (q~${webp.quality})`
        : 'none (JPEG smaller at tested qualities)'

      results.push({
        file: `${dirName}/${filename}`,
        before,
        jpeg: jpegBuf.length,
        webp: webpNote,
      })
    } catch (error) {
      console.error(`  ${dirName}/${filename}: failed - ${error.message}`)
    }
  }

  return results
}

async function optimizeFavicon() {
  const iconsDir = join(publicDir, 'icons')
  await mkdir(iconsDir, { recursive: true })

  const faviconPath = join(iconsDir, 'favicon.png')
  try {
    await stat(faviconPath)
  } catch {
    return null
  }

  const before = (await stat(faviconPath)).size
  const buf = await readFile(faviconPath)
  const out = await sharp(buf)
    .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer()
  await writeFile(faviconPath, out)

  for (const size of [32, 16]) {
    const png = await sharp(buf)
      .resize(size, size, { fit: 'cover' })
      .png({ compressionLevel: 9, palette: true })
      .toBuffer()
    await writeFile(join(iconsDir, `favicon-${size}.png`), png)
  }

  return { file: 'icons/favicon.png', before, after: out.length }
}

const allResults = []
for (const dir of imageDirs) {
  allResults.push(...(await optimizeJpegInDir(dir)))
}

const faviconResult = await optimizeFavicon()

console.log('Optimized images:')
for (const row of allResults) {
  const saved = row.before - row.jpeg
  const pct = row.before > 0 ? Math.round((saved / row.before) * 100) : 0
  console.log(`  ${row.file}: ${row.before} → ${row.jpeg} JPEG (-${pct}%), WebP ${row.webp}`)
}

if (faviconResult) {
  const saved = faviconResult.before - faviconResult.after
  const pct = faviconResult.before > 0 ? Math.round((saved / faviconResult.before) * 100) : 0
  console.log(
    `  ${faviconResult.file}: ${faviconResult.before} → ${faviconResult.after} PNG (-${pct}%)`,
  )
}
