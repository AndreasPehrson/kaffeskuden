# Kaffeskuden - pre-launch checklist

Production URL: **https://kaffeskuden.dk**

Update this file as items are completed. Last reviewed: 2026-05-27.

---

## Must do before launch

### Contact & leads
- [ ] Confirm real **e-mail** (`hej@kaffeskuden.dk` is used in site + JSON-LD - verify inbox exists)
- [x] Replace placeholder **phone** - now `+45 61 78 67 79` in UI + JSON-LD
- [ ] Wire **contact form** to a real backend (currently fakes success after 700 ms - no e-mail is sent)
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
- [x] **Copy tone** - laid-back Danish (see `src/App.tsx`)
- [ ] Confirm **Instagram** handle is correct (`@kaffeskuden`)

### QA
- [ ] **Desktop + mobile** pass on real devices (layout, typography, gallery, form)
- [ ] Verify **scroll nav**: header visibility, active section, Kontakt highlight at bottom of page
- [ ] Check all **images** load in production (`/images/…`, `/brand/…`)
- [ ] Run **Lighthouse** (performance, accessibility, SEO)

---

## Should do (strongly recommended)

### Performance
- [x] **Compress images** - `npm run optimize-images` (`public/images/`, `public/brand/`)
- [x] WebP siblings for gallery images (`PictureImage` + `npm run optimize-images`)
- [ ] Replace `public/icons/favicon.png` source art if you want a sharper icon (current file is optimized PNG)
- [x] `loading="lazy"` on below-the-fold gallery images (via `PictureImage`)
- [x] Removed unused assets (`bønner2`, `bønner3`, duplicate root JPGs, old SVG icons)

### SEO (mostly done - verify after deploy)
- [x] Meta title, description, canonical
- [x] Open Graph + Twitter Card tags
- [x] JSON-LD LocalBusiness schema
- [x] `robots.txt` + `sitemap.xml`
- [ ] Submit sitemap in **Google Search Console**
- [ ] Validate rich results / OG preview (Facebook Debugger, Twitter Card Validator)
- [ ] Re-check JSON-LD **email/phone** match live contact details

### Accessibility
- [x] Hero image is decorative (`aria-hidden` + empty alt); visible copy is in `h1`/lead
- [ ] Keyboard test: nav links, form fields, focus states
- [ ] Color contrast check on hero nav (light text on photo) and contact section

### Repository & ops
- [x] **Asset layout** - `public/images/`, `public/brand/`, `public/icons/`
- [x] Central paths in `src/content/assets.ts`
- [x] Project **README.md**
- [ ] Decide on **analytics** (Plausible, GA4, etc.) - add only if wanted; cookie consent if required

---

## Nice to have (post-launch or later)

- [ ] **404 page** for mistyped URLs
- [ ] **Prerender / SSR** for faster first paint and crawler-friendly HTML (SPA-only today)
- [ ] Blog or “Vores rejser” subpages if content grows (update sitemap)
- [ ] Structured data for individual **events/reviews** if you collect them

---

## Already done

- [x] One-page site: hero, Vores rejser, Galleri, Eventtyper, Kontakt
- [x] Contact form with client-side validation
- [x] Scroll-aware navigation + progress bar
- [x] Favicon (PNG in `public/icons/`)
- [x] SEO baseline in `index.html`
- [x] Production domain: `https://kaffeskuden.dk`
- [x] GitHub Pages deploy on push to `main`
- [x] `npm run build` passes

---

## Quick reference

| Location | Value |
|----------|--------|
| `src/content/assets.ts` | Image and brand paths |
| `src/App.tsx` contact | `hej@kaffeskuden.dk`, `+45 61 78 67 79` |
| `src/App.tsx` `handleSubmit` | simulated delay - no backend yet |
