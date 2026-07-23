'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import { getTestimonialQuoteClass, type TestimonialItem } from './testimonials'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type TestimonialsCarouselProps = {
  testimonials: TestimonialItem[]
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const leaveDurationMs = 240
  const enterDurationMs = 220
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [switchPhase, setSwitchPhase] = useState<'idle' | 'leave' | 'enter'>('idle')
  const [displayedQuote, setDisplayedQuote] = useState(testimonials[0]?.quote || '')
  const [displayedRole, setDisplayedRole] = useState(testimonials[0]?.role || '')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [outgoingItem, setOutgoingItem] = useState<{
    quote: string
    role: string
  } | null>(null)
  const switchTimersRef = useRef<number[]>([])

  const clearSwitchTimers = () => {
    for (const timer of switchTimersRef.current) {
      window.clearTimeout(timer)
    }

    switchTimersRef.current = []
  }

  useEffect(() => {
    return () => {
      for (const timer of switchTimersRef.current) {
        window.clearTimeout(timer)
      }

      switchTimersRef.current = []
    }
  }, [])

  if (testimonials.length === 0) {
    return null
  }

  const handleSelect = (index: number) => {
    if (index === activeIndex || isAnimating) return

    clearSwitchTimers()
    setIsAnimating(true)
    setOutgoingItem({
      quote: displayedQuote,
      role: displayedRole,
    })
    setSwitchPhase('leave')

    switchTimersRef.current.push(
      window.setTimeout(() => {
        setDisplayedQuote(testimonials[index].quote)
        setDisplayedRole(testimonials[index].role)
        setActiveIndex(index)
        setOutgoingItem(null)
        setSwitchPhase('enter')

        switchTimersRef.current.push(
          window.setTimeout(() => {
            setSwitchPhase('idle')
            setIsAnimating(false)
          }, enterDurationMs),
        )
      }, leaveDurationMs),
    )
  }

  const switchContentClass = cn(
    'will-change-[transform,filter,opacity] transition-all duration-500 ease-out',
    switchPhase === 'idle'
      ? 'translate-y-0 scale-100 opacity-100 blur-0'
      : switchPhase === 'leave'
        ? 'translate-y-3 scale-[0.96] opacity-0 blur-md'
        : 'translate-y-1 scale-[0.98] opacity-0 blur-sm',
  )

  const leaveContentClass = cn(
    'will-change-[transform,filter,opacity] transition-all duration-500 ease-out translate-y-0 scale-100 opacity-100 blur-0',
    'translate-y-3 scale-[0.96] opacity-0 blur-md',
  )

  return (
    <div className="flex flex-col items-center gap-10 py-8 sm:py-12">
      <div className="relative px-6 sm:px-8">
        <span className="pointer-events-none absolute -left-1 -top-7 select-none font-heading text-7xl leading-none text-main/15 sm:-left-4 sm:text-8xl">
          “
        </span>

        <div className="grid justify-items-center">
          {outgoingItem ? (
            <p
              aria-hidden="true"
              className={cn(
                'col-start-1 row-start-1 mx-auto max-w-3xl text-center text-foreground',
                leaveContentClass,
                getTestimonialQuoteClass(outgoingItem.quote),
              )}
            >
              {outgoingItem.quote}
            </p>
          ) : null}

          <p
            className={cn(
              'col-start-1 row-start-1 mx-auto max-w-3xl text-center text-foreground',
              switchContentClass,
              getTestimonialQuoteClass(displayedQuote),
            )}
            key={`quote-${activeIndex}`}
            data-collection-grid-reveal-item
          >
            {displayedQuote}
          </p>
        </div>

        <span className="pointer-events-none absolute -bottom-10 -right-1 select-none font-heading text-7xl leading-none text-main/15 sm:-right-4 sm:text-8xl">
          ”
        </span>
      </div>

      <div className="mt-2 flex flex-col items-center gap-6">
        <div className="grid justify-items-center">
          {outgoingItem ? (
            <Badge
              aria-hidden="true"
              variant="neutral"
              className={cn(
                'col-start-1 row-start-1 max-w-xl whitespace-nowrap rounded-full border-2 border-border bg-background px-3 py-1.5 text-center text-sm text-foreground shadow-shadow',
                leaveContentClass,
              )}
            >
              {outgoingItem.role}
            </Badge>
          ) : null}

          <Badge
            variant="neutral"
            className={cn(
              'col-start-1 row-start-1 max-w-xl whitespace-nowrap rounded-full border-2 border-border bg-background px-3 py-1.5 text-center text-sm text-foreground shadow-shadow',
              switchContentClass,
            )}
            key={`role-${activeIndex}`}
            data-collection-grid-reveal-item
          >
            {displayedRole}
          </Badge>
        </div>

        <div className="flex max-w-full flex-wrap items-center justify-center gap-2">
          {testimonials.map((testimonial, index) => {
            const isActive = activeIndex === index
            const isHovered = hoveredIndex === index && !isActive
            const showName = isActive || isHovered

            return (
              <button
                aria-pressed={isActive}
                className={cn(
                  'relative flex min-h-10 cursor-pointer items-center rounded-full border-2 border-border text-left shadow-shadow transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
                  isActive ? 'bg-main text-main-foreground' : 'bg-card hover:bg-secondary-background',
                  showName ? 'py-1.5 pl-1.5 pr-4' : 'p-1',
                )}
                key={testimonial.id}
                onClick={() => handleSelect(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                type="button"
                data-collection-grid-reveal-item
              >
                <span className="relative flex size-8 shrink-0 overflow-hidden rounded-full border-2 border-background bg-secondary-background">
                  {testimonial.avatarUrl ? (
                    <Image
                      alt={testimonial.author}
                      className="h-full w-full object-cover"
                      fill
                      sizes="32px"
                      src={testimonial.avatarUrl}
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs font-bold text-foreground">
                      {getInitials(testimonial.author)}
                    </span>
                  )}
                </span>

                <span
                  className={cn(
                    'grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
                    showName ? 'ml-2 grid-cols-[1fr] opacity-100' : 'ml-0 grid-cols-[0fr] opacity-0',
                  )}
                >
                  <span className="overflow-hidden">
                    <span className="block max-w-[14rem] whitespace-nowrap text-clip text-sm font-bold">
                      {testimonial.author}
                    </span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
