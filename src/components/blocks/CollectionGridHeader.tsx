'use client'

import { MotionReveal } from '@/components/shared/MotionReveal'
import { cn } from '@/utilities/ui'

type CollectionGridHeaderProps = {
  title?: string | null
  description?: string | null
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function CollectionGridHeader({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: CollectionGridHeaderProps) {
  return (
    <div className={cn('space-y-8', className)}>
      {title ? (
        <MotionReveal amount={0.35} duration={0.9} y={18}>
          <h2
            className={cn(
              'max-w-4xl font-heading text-2xl leading-[1.1] sm:text-3xl lg:text-4xl',
              titleClassName,
            )}
          >
            {title}
          </h2>
        </MotionReveal>
      ) : null}
      {description ? (
        <MotionReveal amount={0.35} delay={0.28} duration={0.47} y={18}>
          <p
            className={cn(
              'max-w-3xl text-base leading-relaxed text-foreground/80 sm:text-lg',
              descriptionClassName,
            )}
          >
            {description}
          </p>
        </MotionReveal>
      ) : null}
    </div>
  )
}
