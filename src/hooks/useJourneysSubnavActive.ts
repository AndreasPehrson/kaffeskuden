import { useEffect, useState } from 'react'
import { journeysSubNav } from '../content/navigation'

function hashToSubnavId(hash: string) {
  return journeysSubNav.find((item) => item.hash === hash)?.id ?? null
}

/** Stable subnav highlight: optimistic click + URL hash only (no scroll-spy). */
export function useJourneysSubnavActive(hash: string, enabled: boolean) {
  const [pendingId, setPendingId] = useState<string | null>(null)

  const hashId = hashToSubnavId(hash)

  useEffect(() => {
    if (hashId && pendingId === hashId) {
      setPendingId(null)
    }
  }, [hashId, pendingId])

  const isActive = (itemId: (typeof journeysSubNav)[number]['id']) => {
    if (!enabled) return false
    if (pendingId) return pendingId === itemId
    if (hashId) return hashId === itemId
    return itemId === 'rejser'
  }

  const select = (itemId: (typeof journeysSubNav)[number]['id']) => {
    setPendingId(itemId)
  }

  return { isActive, select }
}
