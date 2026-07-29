import * as React from 'react'

import { MotionReveal } from '@/components/shared/MotionReveal'
import { cn } from '@/utilities/ui'

type PageBlockSectionProps = React.ComponentProps<'section'> & {
  spacing?: 'default' | 'none'
}

export function PageBlockSection({
  className,
  spacing = 'default',
  ...props
}: PageBlockSectionProps) {
  return (
    <section
      className={cn(spacing === 'default' && 'py-8 sm:py-12 lg:py-16', className)}
      {...props}
    />
  )
}

type PageBlockContainerProps = React.ComponentProps<'div'> & { container?: boolean }

export function PageBlockContainer({ className, container = true, ...props }: PageBlockContainerProps) {
  return <div className={cn(container && 'container', className)} {...props} />
}

type PageBlockSurfaceProps = React.ComponentProps<'div'>

export function PageBlockSurface({ className, ...props }: PageBlockSurfaceProps) {
  return (
    <div
      className={cn('rounded-base border-2 border-border bg-card shadow-shadow', className)}
      {...props}
    />
  )
}

type PageBlockHeaderProps = {
  title?: string | null
  description?: string | null
  className?: string
  titleClassName?: string
  descriptionClassName?: string
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

function renderHeading(
  headingLevel: 1 | 2 | 3 | 4 | 5 | 6,
  className: string,
  children: React.ReactNode,
) {
  switch (headingLevel) {
    case 1:
      return <h1 className={className}>{children}</h1>
    case 2:
      return <h2 className={className}>{children}</h2>
    case 3:
      return <h3 className={className}>{children}</h3>
    case 4:
      return <h4 className={className}>{children}</h4>
    case 5:
      return <h5 className={className}>{children}</h5>
    case 6:
      return <h6 className={className}>{children}</h6>
  }
}

export function PageBlockHeader({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  headingLevel = 2,
}: PageBlockHeaderProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {title ? (
        <MotionReveal amount={0.35} duration={0.47} margin="0px 0px -25% 0px" y={14}>
          {renderHeading(
            headingLevel,
            cn(
              'max-w-4xl font-heading text-2xl leading-[1.1] sm:text-3xl lg:text-4xl',
              titleClassName,
            ),
            title,
          )}
        </MotionReveal>
      ) : null}
      {description ? (
        <MotionReveal
          amount={0.35}
          delay={0.08}
          duration={0.47}
          margin="0px 0px -25% 0px"
          y={12}
        >
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

type PageBlockEmptyStateProps = {
  title?: string
  description?: string | null
  className?: string
}

export function PageBlockEmptyState({
  title = 'Пока нет содержимого',
  description = 'В этом блоке пока нет данных.',
  className,
}: PageBlockEmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-base border-2 border-border bg-secondary-background/60 p-4 text-foreground shadow-shadow sm:p-6',
        className,
      )}
    >
      <p className="font-heading text-lg leading-tight">{title}</p>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/80">
          {description}
        </p>
      ) : null}
    </div>
  )
}
