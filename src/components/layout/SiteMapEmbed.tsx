'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { MotionReveal } from '@/components/shared/MotionReveal'
import { cn } from '@/utilities/ui'

type SiteMapEmbedProps = {
  src: string
}

export function SiteMapEmbed({ src }: SiteMapEmbedProps) {
  const [isActive, setIsActive] = useState(false)

  if (!src) {
    return null
  }

  return (
    <section className="relative">
      <MotionReveal amount={0.3} blur={2} duration={0.55} y={24}>
        <div className="relative left-1/2 h-95 w-screen -translate-x-1/2 overflow-hidden sm:h-110 lg:h-130">
          <iframe
            className={cn(
              'absolute inset-0 h-full w-full',
              isActive ? 'pointer-events-auto' : 'pointer-events-none',
            )}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={src}
            title="Карта проезда"
          />
          {!isActive ? (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 bg-linear-to-b from-transparent from-50% to-border"
              />
              <div
                className="absolute inset-0 z-10 flex cursor-pointer items-end justify-start p-4"
                onClick={() => setIsActive(true)}
              >
                <Button onClick={() => setIsActive(true)} size="sm" type="button">
                  Нажмите, чтобы управлять картой
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </MotionReveal>
    </section>
  )
}
