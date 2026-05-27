/**
 * Static asset paths (served from `public/`).
 * Run `npm run optimize-images` after adding or replacing photos.
 */

export const brand = {
  logo: '/brand/logo.jpg',
} as const

export const images = {
  hero: '/images/hero.jpg',
  beans: '/images/bønner.jpg',
  gallery: {
    truck: '/images/skuden.jpg',
    event: '/images/stemning3.jpg',
    barista: '/images/niclas.jpg',
    mood: '/images/stemning.jpg',
    guests: '/images/stemning2.jpg',
    tasting: '/images/test-smagning.jpg',
  },
} as const

/**
 * JPEG paths with a WebP sibling on disk (see `npm run optimize-images`).
 * PictureImage only emits `<source type="image/webp">` for these paths.
 */
export const imagesWithWebp = new Set<string>([
  images.hero,
  images.beans,
  ...Object.values(images.gallery),
])

export const routes = {
  home: '/',
  journeys: '/vores-rejser',
} as const

/** Absolute URLs for SEO / Open Graph (production host). */
export const siteUrl = 'https://kaffeskuden.dk'

export const ogImage = `${siteUrl}${images.hero}`
