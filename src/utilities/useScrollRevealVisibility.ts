'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

type ScrollRevealOptions = {
  amount?: number
  margin?: string
  once?: boolean
}

function expandMarginValues(margin: string) {
  const values = margin.trim().split(/\s+/)

  if (values.length === 1) return [values[0], values[0], values[0], values[0]]
  if (values.length === 2) return [values[0], values[1], values[0], values[1]]
  if (values.length === 3) return [values[0], values[1], values[2], values[1]]

  return values.slice(0, 4)
}

function getViewportRelativeMargin(margin: string) {
  const sides = expandMarginValues(margin)

  // IntersectionObserver resolves all percentage root margins against the
  // viewport width. For vertical reveal zones that makes `-25%` far too large
  // on wide screens, so resolve top and bottom percentages from viewport height.
  return sides
    .map((value, index) => {
      if (!value.endsWith('%')) return value

      const percentage = Number.parseFloat(value)
      if (!Number.isFinite(percentage)) return value

      const base = index === 0 || index === 2 ? window.innerHeight : window.innerWidth
      return `${(percentage / 100) * base}px`
    })
    .join(' ')
}

export function useScrollRevealVisibility<T extends Element>(
  targetRef: RefObject<T | null>,
  { amount = 0.08, margin = '0px', once = false }: ScrollRevealOptions = {},
) {
  const [isVisible, setIsVisible] = useState(false)
  const hasRevealedRef = useRef(false)

  useEffect(() => {
    const target = targetRef.current
    if (!target) {
      return
    }

    if (typeof IntersectionObserver === 'undefined') {
      const frame = window.requestAnimationFrame(() => setIsVisible(true))
      return () => window.cancelAnimationFrame(frame)
    }

    let triggerObserver: IntersectionObserver | undefined
    let viewportObserver: IntersectionObserver | undefined
    let observerVersion = 0

    const observe = () => {
      if (once && hasRevealedRef.current) {
        return
      }

      triggerObserver?.disconnect()
      viewportObserver?.disconnect()

      const currentVersion = ++observerVersion
      let hasInitialTriggerState = false
      let hasInitialViewportState = false
      let isInRevealZone = false
      let isInViewport = false

      const reveal = () => {
        setIsVisible(true)

        if (once) {
          hasRevealedRef.current = true
          triggerObserver?.disconnect()
          viewportObserver?.disconnect()
        }
      }

      const revealInitiallyVisibleTarget = () => {
        if (
          hasInitialTriggerState &&
          hasInitialViewportState &&
          isInViewport &&
          !isInRevealZone
        ) {
          reveal()
        }
      }

      triggerObserver = new IntersectionObserver(
        ([entry]) => {
          if (currentVersion !== observerVersion) {
            return
          }

          hasInitialTriggerState = true
          isInRevealZone = entry.isIntersecting

          if (entry.isIntersecting) {
            reveal()
            return
          }

          // If scroll restoration places a target inside the viewport but
          // outside the reveal zone, keep it visible instead of leaving it
          // stuck in the initial hidden state.
          revealInitiallyVisibleTarget()
        },
        { rootMargin: getViewportRelativeMargin(margin), threshold: amount },
      )

      viewportObserver = new IntersectionObserver(
        ([entry]) => {
          if (currentVersion !== observerVersion) {
            return
          }

          hasInitialViewportState = true
          isInViewport = entry.isIntersecting

          if (entry.isIntersecting) {
            revealInitiallyVisibleTarget()
            return
          }

          if (once) {
            return
          }

          const { bottom, top } = entry.boundingClientRect
          if (top >= window.innerHeight) {
            setIsVisible(false)
          } else if (bottom <= 0) {
            setIsVisible(true)
          }
        },
        { threshold: 0 },
      )

      triggerObserver.observe(target)
      viewportObserver.observe(target)
    }

    observe()
    window.addEventListener('resize', observe)

    return () => {
      observerVersion += 1
      triggerObserver?.disconnect()
      viewportObserver?.disconnect()
      window.removeEventListener('resize', observe)
    }
  }, [amount, margin, once, targetRef])

  return isVisible
}
