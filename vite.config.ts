import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/** Custom domain serves at / — never use /repo/ as base in production. */
function resolveBase() {
  const explicit = process.env.VITE_BASE_PATH
  if (explicit != null && explicit !== '') {
    let base = explicit
    if (!base.startsWith('/')) base = `/${base}`
    if (!base.endsWith('/')) base = `${base}/`
    return base
  }

  return '/'
}

// https://vite.dev/config/
export default defineConfig({
  base: resolveBase(),
  plugins: [react()],
})
