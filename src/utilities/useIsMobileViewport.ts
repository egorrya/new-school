'use client'

import { useSyncExternalStore } from 'react'

const mobileQuery = '(max-width: 639.98px)'

function subscribe(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  const query = window.matchMedia(mobileQuery)
  query.addEventListener('change', onStoreChange)

  return () => query.removeEventListener('change', onStoreChange)
}

function getSnapshot() {
  return typeof window !== 'undefined' && window.matchMedia(mobileQuery).matches
}

function getServerSnapshot() {
  return true
}

export function useIsMobileViewport() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

// A one-time, non-reactive read for callers that need the real viewport
// synchronously on the client's first render (e.g. to decide a Motion
// `initial` prop, which only applies at mount) and can't wait for
// useIsMobileViewport's SSR-safe guess-then-correct render to settle.
export function getIsMobileViewportSync() {
  return getSnapshot()
}
