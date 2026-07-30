'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import {
  getTestimonialQuoteClass,
  getTestimonialQuoteWidth,
  type TestimonialItem,
} from './testimonials'

import { MotionReveal } from '@/components/shared/MotionReveal'
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
  const getQuoteReserve = (description?: string | null) => (description ? 128 : 112)
  const quoteVerticalReserve = getQuoteReserve(testimonials[0]?.description)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [switchPhase, setSwitchPhase] = useState<'idle' | 'leave' | 'enter'>('idle')
  const [displayedQuote, setDisplayedQuote] = useState(testimonials[0]?.quote || '')
  const [displayedRole, setDisplayedRole] = useState(testimonials[0]?.role || '')
  const [displayedDescription, setDisplayedDescription] = useState(
    testimonials[0]?.description || null,
  )
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [contentHeight, setContentHeight] = useState<number | null>(null)
  const [quoteReserve, setQuoteReserve] = useState(quoteVerticalReserve)
  const [outgoingItem, setOutgoingItem] = useState<{
    quote: string
    role: string
    description: string | null
  } | null>(null)
  const switchTimersRef = useRef<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLParagraphElement>(null)

  const clearSwitchTimers = () => {
    for (const timer of switchTimersRef.current) {
      window.clearTimeout(timer)
    }

    switchTimersRef.current = []
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (quoteRef.current) {
        const height = quoteRef.current.offsetHeight + quoteReserve
        setContentHeight(height)
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [activeIndex, quoteReserve])

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
      description: displayedDescription,
    })
    setSwitchPhase('leave')

    switchTimersRef.current.push(
      window.setTimeout(() => {
        setDisplayedQuote(testimonials[index].quote)
        setDisplayedRole(testimonials[index].role)
        setDisplayedDescription(testimonials[index].description || null)
        setQuoteReserve(getQuoteReserve(testimonials[index].description))
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
    'will-change-[transform,opacity] transition-all duration-500 ease-out',
    switchPhase === 'idle'
      ? 'translate-y-0 scale-100 opacity-100'
      : switchPhase === 'leave'
        ? 'translate-y-3 scale-[0.96] opacity-0'
        : 'translate-y-1 scale-[0.98] opacity-0',
  )

  const leaveContentClass = cn(
    'will-change-[transform,opacity] transition-all duration-500 ease-out translate-y-0 scale-100 opacity-100',
    'translate-y-3 scale-[0.96] opacity-0',
  )

  return (
    <MotionReveal amount={0.35} duration={0.47} y={18}>
      <div
        className={cn(
          'flex flex-col items-center',
          displayedDescription ? 'gap-10' : 'gap-4 sm:gap-6',
        )}
      >
        <div
          className="relative w-full px-0 pt-14 pb-12 transition-all duration-500 sm:px-8"
          ref={containerRef}
          style={{ height: contentHeight ? `${contentHeight}px` : 'auto' }}
        >
          <span
            className={cn(
              'pointer-events-none absolute -left-1 top-0 select-none font-heading text-7xl leading-none text-main/15 sm:-left-4 sm:text-8xl',
              switchContentClass,
            )}
          >
            &quot;
          </span>

          <div className="grid w-full justify-items-center">
            {outgoingItem ? (
              <p
                aria-hidden="true"
                className={cn(
                  'col-start-1 row-start-1 mx-auto text-center text-foreground',
                  leaveContentClass,
                  getTestimonialQuoteClass(outgoingItem.quote),
                  getTestimonialQuoteWidth(outgoingItem.quote),
                )}
              >
                {outgoingItem.quote}
              </p>
            ) : null}

            <p
              ref={quoteRef}
              className={cn(
                'col-start-1 row-start-1 mx-auto text-center text-foreground',
                switchContentClass,
                getTestimonialQuoteClass(displayedQuote),
                getTestimonialQuoteWidth(displayedQuote),
              )}
              key={`quote-${activeIndex}`}
              data-collection-grid-reveal-item
            >
              {displayedQuote}
            </p>
          </div>

          <span
            className={cn(
              'pointer-events-none absolute -right-1 bottom-0 select-none font-heading text-7xl leading-none text-main/15 sm:-right-4 sm:text-8xl',
              switchContentClass,
            )}
          >
            &quot;
          </span>
        </div>

        <div
          className={cn(
            'flex flex-col items-center',
            displayedDescription ? 'mt-2 gap-6' : 'mt-0 gap-3 sm:gap-4',
          )}
        >
          {displayedRole ? (
            <div className="grid justify-items-center">
              {outgoingItem && outgoingItem.role ? (
                <Badge
                  aria-hidden="true"
                  variant="neutral"
                  className={cn(
                    'col-start-1 row-start-1 max-w-xl whitespace-nowrap rounded-full border border-border bg-background px-3 py-1.5 text-center text-sm text-foreground shadow-shadow',
                    leaveContentClass,
                  )}
                >
                  {outgoingItem.role}
                </Badge>
              ) : null}

              <Badge
                variant="neutral"
                className={cn(
                  'col-start-1 row-start-1 max-w-xl whitespace-nowrap rounded-full border border-border bg-background px-3 py-1.5 text-center text-sm text-foreground shadow-shadow',
                  switchContentClass,
                )}
                key={`role-${activeIndex}`}
                data-collection-grid-reveal-item
              >
                {displayedRole}
              </Badge>
            </div>
          ) : null}

          {displayedDescription ? (
            <p
              className={cn(
                'grid justify-items-center text-center text-sm text-muted-foreground max-w-2xl',
                switchContentClass,
              )}
            >
              {displayedDescription}
            </p>
          ) : null}

          <div className="flex max-w-full flex-wrap items-center justify-center gap-2">
            {testimonials.map((testimonial, index) => {
              const isActive = activeIndex === index
              const isHovered = hoveredIndex === index && !isActive
              const showName = isActive || isHovered

              return (
                <button
                  aria-pressed={isActive}
                  className={cn(
                    'relative flex min-h-12 cursor-pointer items-center rounded-full border border-border text-left shadow-shadow transition-all duration-500 ease-in-out',
                    isActive
                      ? 'bg-black text-white'
                      : 'bg-card hover:bg-secondary-background',
                    showName ? 'px-1 py-1' : 'p-0.5',
                  )}
                  key={testimonial.id}
                  onClick={() => handleSelect(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  type="button"
                  data-collection-grid-reveal-item
                >
                  <span className="relative flex size-12 shrink-0 overflow-hidden rounded-full bg-secondary-background">
                    {testimonial.avatarUrl ? (
                      <Image
                        alt={testimonial.author}
                        className="h-full w-full object-cover"
                        fill
                        priority={isActive}
                        sizes="48px"
                        src={testimonial.avatarUrl}
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-sm font-normal text-foreground">
                        {getInitials(testimonial.author)}
                      </span>
                    )}
                  </span>

                  <span
                    className={cn(
                      'grid transition-all duration-500 ease-in-out',
                      showName
                        ? 'ml-3 mr-3 grid-cols-[1fr] opacity-100'
                        : 'ml-0 mr-0 grid-cols-[0fr] opacity-0',
                    )}
                  >
                    <span className="overflow-hidden">
                      <span className="block max-w-56 whitespace-nowrap text-clip text-sm font-normal">
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
    </MotionReveal>
  )
}
