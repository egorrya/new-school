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
