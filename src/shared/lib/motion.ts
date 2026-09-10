import { animate, type AnimationOptions, type AnimationPlaybackControls, type DOMKeyframesDefinition } from 'motion'

export type MotionControl = AnimationPlaybackControls | null | undefined
export type MotionTarget = HTMLElement | SVGElement

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function stopMotionControls(...controls: MotionControl[]) {
  for (const control of controls) {
    control?.stop()
  }
}

export function setMotionStyles(targets: MotionTarget | MotionTarget[], styles: Partial<CSSStyleDeclaration>) {
  const list = Array.isArray(targets) ? targets : [targets]

  for (const target of list) {
    Object.assign(target.style, styles)
  }
}

type StaggeredMotionOptions = AnimationOptions & {
  delay?: number
  stagger?: number
}

export function animateStaggeredTargets(
  targets: MotionTarget[],
  keyframes: DOMKeyframesDefinition,
  options: StaggeredMotionOptions = {},
): ReturnType<typeof animate>[] {
  const { delay = 0, stagger = 0, ...animationOptions } = options

  return targets.map((target, index) =>
    animate(target, keyframes, {
      ...animationOptions,
      delay: delay + index * stagger,
    }),
  )
}

export function getViewportExitDirection(entry: IntersectionObserverEntry): 1 | -1 {
  return entry.boundingClientRect.top < 0 ? 1 : -1
}

type ViewportMotionOptions = {
  root?: Element | Document
  margin?: string
  amount?: 'some' | 'all' | number
  onEnter: (entry: IntersectionObserverEntry) => void
  onLeave?: (entry: IntersectionObserverEntry) => void
}

export function observeViewportMotion(
  target: Element | Element[],
  { onEnter, onLeave, ...options }: ViewportMotionOptions,
) {
  const targets = Array.isArray(target) ? target : [target]
  const threshold = options.amount === 'all' ? 1 : options.amount === 'some' ? 0 : options.amount ?? 0
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          onEnter(entry)
        } else if (onLeave) {
          onLeave(entry)
        }
      }
    },
    {
      root: options.root instanceof Document ? options.root.documentElement : options.root ?? null,
      rootMargin: options.margin,
      threshold,
    },
  )

  for (const element of targets) {
    observer.observe(element)
  }

  return () => observer.disconnect()
}
