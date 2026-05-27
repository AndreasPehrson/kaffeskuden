/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** RSS.app wall ID from embed code (optional — default is in src/content/instagram.ts) */
  readonly VITE_RSSAPP_WALL_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
