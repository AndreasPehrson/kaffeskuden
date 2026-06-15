# Kaffeskuden

One-page marketing site for [kaffeskuden.dk](https://kaffeskuden.dk) - Vite, React, TypeScript, static deploy on GitHub Pages.

## Project layout

```
.github/workflows/   CI: build + GitHub Pages deploy
docs/                Launch checklist and notes
public/
  images/            Site photos (JPEG + WebP from optimize script)
  brand/             Logo
  icons/             Favicons
  CNAME              Custom domain for Pages
  robots.txt
  sitemap.xml
scripts/             Image optimization (sharp)
src/
  content/assets.ts   Image paths and routes
  content/journeys.ts Vores rejser chapter copy (placeholder)
  pages/HomePage.tsx  Forside
  pages/VoresRejserPage.tsx  Rejser + galleri
  layout/SiteLayout.tsx  Header, scroll-spy, page transitions
  components/         Shared UI (header, gallery, contact form)
```

## Commands

```bash
npm install
npm run dev          # local dev server
npm run build        # production build → dist/
npm run optimize-images   # compress JPEGs, generate WebP, shrink favicons
npm run worker:dev     # contact API (wrangler) - run in a second terminal with npm run dev
npm run worker:deploy  # deploy contact API to Cloudflare Workers
```

## Adding photos

1. Drop new JPEGs in `public/images/` (or `public/brand/` for logo).
2. Reference paths in `src/content/assets.ts`.
3. Run `npm run optimize-images` and commit both `.jpg` and `.webp` when generated.

## Instagram feed

Instagram grid on **Vores rejser** is self-hosted - see [docs/INSTAGRAM.md](docs/INSTAGRAM.md).

Do not keep duplicate images in the repo root - assets live only under `public/`.

## Routes

| Path | Page |
|------|------|
| `/` | Forside (hero, teaser, events, kontakt) |
| `/vores-rejser` | Rejser (alternating splits + galleri) |

Client routing uses React Router. `postbuild` copies `index.html` to `404.html` for GitHub Pages SPA fallback.

## Deploy

Push to `main` triggers [.github/workflows/deploy.yml](.github/workflows/deploy.yml) with `VITE_BASE_PATH=/`.

### Contact form (Resend + Cloudflare Worker)

The static site cannot hold the Resend API key. A small Worker in `workers/contact.ts` sends mail via Resend.

| Setting | Value |
|---------|-------|
| **From** | `kontakt@kaffeskuden.dk` |
| **To** | `kontakt@kaffeskuden.dk` (forwards to your inbox via Cloudflare) |
| **API** | `https://api.kaffeskuden.dk` |

**One-time setup:**

1. Verify `kaffeskuden.dk` in [Resend → Domains](https://resend.com/domains).
2. Copy `.dev.vars.example` → `.dev.vars` and paste your `RESEND_API_KEY`.
3. Log in to Cloudflare: `npx wrangler login`
4. Deploy worker + secret: `npm run worker:setup`
5. DNS for `api.kaffeskuden.dk` is created automatically when the worker deploys (zone must be on Cloudflare).

**Local dev:** `npm run worker:dev` (terminal 1) + `npm run dev` (terminal 2).  
Until the domain is verified in Resend, keep `CONTACT_FROM=onboarding@resend.dev` in `.dev.vars`.

Pre-launch tasks: [docs/LAUNCH.md](docs/LAUNCH.md).
