import { images } from './assets'

export type GalleryPhoto = {
  id: string
  src: string
  alt: string
  /** CSS object-position for nicer crops */
  focal?: string
}

export const galleryLead: GalleryPhoto = {
  id: 'truck',
  src: images.gallery.truck,
  alt: 'Kaffeskuden på lokation',
  focal: 'center 55%',
}

export const galleryGrid: GalleryPhoto[] = [
  {
    id: 'event',
    src: images.gallery.event,
    alt: 'Servering i eventmiljø',
    focal: 'center 40%',
  },
  {
    id: 'barista',
    src: images.gallery.barista,
    alt: 'Barista ved Kaffeskuden',
    focal: 'center 25%',
  },
  {
    id: 'mood',
    src: images.gallery.mood,
    alt: 'Kaffestemning ved servering',
  },
  {
    id: 'guests',
    src: images.gallery.guests,
    alt: 'Gæster ved kaffebaren',
    focal: 'center 45%',
  },
  {
    id: 'tasting',
    src: images.gallery.tasting,
    alt: 'Smagning af kaffe',
    focal: 'center 35%',
  },
]
