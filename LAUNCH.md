# Kaffeskuden — pre-launch checklist

Production URL: **https://kaffeskuden.dk**

Update this file as items are completed. Last reviewed: 2026-05-27.

---

## Must do before launch

### Contact & leads
- [ ] Confirm real **e-mail** (`hej@kaffeskuden.dk` is used in site + JSON-LD — verify inbox exists)
- [x] Replace placeholder **phone** — now `+45 61 78 67 79` in UI + JSON-LD
- [ ] Wire **contact form** to a real backend (currently fakes success after 700 ms — no e-mail is sent)
  - Options: Formspree, Netlify Forms, custom API, etc.
- [ ] Test a real form submission end-to-end after wiring

### Hosting & domain
- [ ] Point **kaffeskuden.dk** DNS to host
- [ ] Enable **HTTPS** (SSL certificate)
- [ ] Redirect **www → non-www** (or pick one canonical host and stick to it)
- [ ] Keep **trailing slash** consistent with canonical (`https://kaffeskuden.dk/`)
- [ ] Configure **SPA fallback** so direct links and refresh work (e.g. `/* /index.html 200` on Netlify)
- [ ] Run `npm run build` and deploy **`dist/`** (plus ensure `robots.txt` + `sitemap.xml` are served)

### Content & copy
- [ ] Final **copy review** (Danish spelling, tone, event types, hero text)
- [ ] Confirm **Instagram** handle is correct (`@kaffeskuden`)
- [ ] Add **privacy notice** if the contact form stores/sends personal data (GDPR)

### QA
- [ ] **Desktop + mobile** pass on real devices (layout, typography, gallery, form)
- [ ] Verify **scroll nav**: header visibility, active section, Kontakt highlight at bottom of page
- [ ] Check all **images** load in production (paths, filenames with `ø`/`æ`)
- [ ] Run **Lighthouse** (performance, accessibility, SEO)

---

## Should do (strongly recommended)

### Performance
- [ ] **Compress images** — several large JPGs in `public/`:
  - `stemning3.jpg` (~520 KB), `skuden.jpg` (~430 KB), `stemning2.jpg` (~300 KB), etc.
  - Consider WebP/AVIF variants with JPG fallback
- [ ] Shrink **favicon.png** (~280 KB — should be much smaller)
- [ ] Add `loading="lazy"` on below-the-fold gallery images
- [ ] Remove or exclude **unused assets** from deploy: `bønner2.jpg`, `bønner3.jpg`, duplicate root JPGs, old `favicon.svg` / `icons.svg` if not needed

### SEO (mostly done — verify after deploy)
- [x] Meta title, description, canonical
- [x] Open Graph + Twitter Card tags
- [x] JSON-LD LocalBusiness schema
- [x] `robots.txt` + `sitemap.xml`
- [ ] Submit sitemap in **Google Search Console**
- [ ] Validate rich results / OG preview (Facebook Debugger, Twitter Card Validator)
- [ ] Re-check JSON-LD **email/phone** match live contact details

### Accessibility
- [ ] Hero image has empty `alt` (decorative) — OK if text covers content; otherwise add descriptive alt
- [ ] Keyboard test: nav links, form fields, focus states
- [ ] Color contrast check on hero nav (light text on photo) and contact section

### Repository & ops
- [ ] Initial **git commit** (repo currently has no commits)
- [ ] Push to remote (GitHub/GitLab) and connect host for CI deploy
- [ ] Replace default **README.md** with project-specific notes (optional)
- [ ] Decide on **analytics** (Plausible, GA4, etc.) — add only if wanted; cookie consent if required

---

## Nice to have (post-launch or later)

- [ ] **404 page** for mistyped URLs
- [ ] **Prerender / SSR** for faster first paint and crawler-friendly HTML (SPA-only today)
- [ ] Blog or “Vores rejser” subpages if content grows (update sitemap)
- [ ] Structured data for individual **events/reviews** if you collect them
- [ ] Automated deploy on push to `main`

---

## Already done

- [x] One-page site: hero, Vores rejser, Galleri, Eventtyper, Kontakt
- [x] Contact form with client-side validation
- [x] Scroll-aware navigation + progress bar
- [x] Favicon (PNG, transparent)
- [x] SEO baseline in `index.html`
- [x] Production domain confirmed: `https://kaffeskuden.dk`
- [x] `npm run build` passes

---

## Quick reference — placeholder values to replace

| Location | Current value |
|----------|----------------|
| `src/App.tsx` contact links | `hej@kaffeskuden.dk`, `+45 61 78 67 79` |
| `index.html` JSON-LD | same email/phone |
| `src/App.tsx` `handleSubmit` | simulated delay — no backend |
