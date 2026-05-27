import feed from './instagram-feed.json'
import { images } from './assets'

export const instagramProfileUrl = 'https://www.instagram.com/kaffeskuden/'

export type InstagramPost = {
  id: string
  caption: string
  permalink: string
  image: string
  timestamp?: string
  mediaType?: string
}

/** Shown until `npm run fetch-instagram` fills the manifest. */
const curatedFallback: InstagramPost[] = [
  {
    id: 'curated-truck',
    caption: 'Kaffeskuden på vejen',
    permalink: instagramProfileUrl,
    image: images.gallery.truck,
  },
  {
    id: 'curated-event',
    caption: 'Event og stemning',
    permalink: instagramProfileUrl,
    image: images.gallery.event,
  },
  {
    id: 'curated-barista',
    caption: 'Barista i arbejde',
    permalink: instagramProfileUrl,
    image: images.gallery.barista,
  },
  {
    id: 'curated-mood',
    caption: 'Kaffestemning',
    permalink: instagramProfileUrl,
    image: images.gallery.mood,
  },
  {
    id: 'curated-guests',
    caption: 'Gæster ved baren',
    permalink: instagramProfileUrl,
    image: images.gallery.guests,
  },
  {
    id: 'curated-tasting',
    caption: 'Smagning og oplevelser',
    permalink: instagramProfileUrl,
    image: images.gallery.tasting,
  },
]

const manifestPosts = feed.posts as InstagramPost[]
const livePosts = manifestPosts.length > 0 ? manifestPosts.slice(0, 6) : curatedFallback

export const instagramFeed = {
  username: feed.username || 'kaffeskuden',
  updatedAt: feed.updatedAt,
  posts: livePosts,
  isLive: manifestPosts.length > 0,
} as const
