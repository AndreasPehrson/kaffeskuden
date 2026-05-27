/** GitHub Pages SPA fallback: serve index.html for unknown paths. */
import { copyFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
await copyFile(join(dist, 'index.html'), join(dist, '404.html'))
console.log('Copied dist/index.html → dist/404.html (SPA fallback)')
