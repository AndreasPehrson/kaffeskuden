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
npm run preview      # serve dist/ locally
```

## Adding photos

1. Drop new JPEGs in `public/images/` (or `public/brand/` for logo).
2. Reference paths in `src/content/assets.ts`.
3. Run `npm run optimize-images` and commit both `.jpg` and `.webp` when generated.

## Instagram feed

Instagram grid on **Vores rejser** is self-hosted — see [docs/INSTAGRAM.md](docs/INSTAGRAM.md).

Do not keep duplicate images in the repo root - assets live only under `public/`.

## Routes

| Path | Page |
|------|------|
| `/` | Forside (hero, teaser, events, kontakt) |
| `/vores-rejser` | Rejser (alternating splits + galleri) |

Client routing uses React Router. `postbuild` copies `index.html` to `404.html` for GitHub Pages SPA fallback.

## Deploy

Push to `main` triggers [.github/workflows/deploy.yml](.github/workflows/deploy.yml) with `VITE_BASE_PATH=/`.

Pre-launch tasks: [docs/LAUNCH.md](docs/LAUNCH.md).
