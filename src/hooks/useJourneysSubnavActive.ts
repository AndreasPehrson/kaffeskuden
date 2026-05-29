import { useEffect, useState } from 'react'
import { journeysSubNav } from '../content/navigation'

function hashToSubnavId(hash: string) {
  return journeysSubNav.find((item) => item.hash === hash)?.id ?? null
}

/** Subnav highlight: optimistic click, scroll-spy, URL hash, then default. */
export function useJourneysSubnavActive(
  hash: string,
  enabled: boolean,
  scrollSectionId = '',
) {
  const [pendingId, setPendingId] = useState<string | null>(null)

  const hashId = hashToSubnavId(hash)
  const scrollId =
    scrollSectionId &&
    journeysSubNav.some((item) => item.id === scrollSectionId)
      ? scrollSectionId
      : null

  useEffect(() => {
    if (hashId && pendingId === hashId) {
      setPendingId(null)
    }
  }, [hashId, pendingId])

  const isActive = (itemId: (typeof journeysSubNav)[number]['id']) => {
    if (!enabled) return false
    if (pendingId) return pendingId === itemId
    if (scrollId) return scrollId === itemId
    if (hashId) return hashId === itemId
    return itemId === 'rejser'
  }

  const select = (itemId: (typeof journeysSubNav)[number]['id']) => {
    setPendingId(itemId)
  }

  return { isActive, select }
}
