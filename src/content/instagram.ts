/** RSS.app wall embed for @kaffeskuden (https://rss.app) */
export const RSSAPP_WALL_SCRIPT = 'https://widget.rss.app/v1/wall.js'

/** Default wall from rss.app embed code; override with VITE_RSSAPP_WALL_ID in .env */
export const DEFAULT_RSSAPP_WALL_ID = 'mHpktXDGwxwACyOr'

export const rssAppWallId =
  import.meta.env.VITE_RSSAPP_WALL_ID?.trim() || DEFAULT_RSSAPP_WALL_ID
