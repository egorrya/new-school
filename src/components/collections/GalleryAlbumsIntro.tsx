'use client'

import { MotionReveal } from '@/components/shared/MotionReveal'

import { cn } from '@/utilities/ui'

type GalleryAlbumsIntroProps = {
  title: string
  description?: string | null
  className?: string
}

export function GalleryAlbumsIntro({ title, description, className }: GalleryAlbumsIntroProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <MotionReveal amount={0.35} duration={0.47} y={18}>
        <h1 className="max-w-4xl font-heading text-2xl leading-[1.1] sm:text-3xl lg:text-4xl">
          {title}
        </h1>
      </MotionReveal>
      {description ? (
        <MotionReveal amount={0.35} delay={0.08} duration={0.43} y={18}>
          <p className="max-w-3xl text-base leading-relaxed text-foreground/80 sm:text-lg">
            {description}
          </p>
        </MotionReveal>
      ) : null}
    </div>
  )
}
