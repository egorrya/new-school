'use client'

import Link from 'next/link'
import { MotionReveal } from '@/components/shared/MotionReveal'

import type { HeroBlock as HeroBlockType } from '@/payload-types'

import { HeroBlobIllustration } from './HeroBlobIllustration'
import { Button } from '@/components/ui/button'

import { PageBlockContainer, PageBlockSection } from '@/components/shared/PageBlock'

import { cn } from '@/utilities/ui'

type HeroBlockProps = HeroBlockType & {
  fullScreen?: boolean
}

export function HeroBlock({
  title,
  description,
  image,
  showBlobBackground,
  customBlobPositioning,
  kidsImage,
  primaryButtonLabel,
  primaryButtonLink,
  fullScreen = false,
}: HeroBlockProps) {
  const hasPrimaryAction = Boolean(primaryButtonLabel && primaryButtonLink)
  const primaryHref = primaryButtonLink || '/'
  const fullScreenStyle = fullScreen
    ? {
        minHeight: 'calc(100dvh - var(--site-header-height, 0px))',
        marginTop:
          'calc(-1 * (var(--site-header-height, 0px) + var(--site-header-top-offset, 0px)))',
      }
    : undefined

  return (
    <PageBlockSection
      style={fullScreenStyle}
      className={cn('py-0', fullScreen && 'flex items-center')}
    >
      <PageBlockContainer className={cn(fullScreen && 'flex h-full items-center')}>
        <div className="relative w-full overflow-visible">
          <div
            className={cn(
              'relative grid items-center gap-8 p-4 sm:p-6 lg:p-8',
              fullScreen
                ? 'min-h-[calc(100dvh-var(--site-header-height,0px))] w-full items-center lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,1.05fr)] lg:gap-10'
                : 'lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,1.05fr)]',
            )}
          >
            <div className={cn('space-y-6', fullScreen && 'max-w-3xl')}>
              <div className="space-y-6">
                <MotionReveal amount={0.2} duration={1.6} y={18}>
                  <h2 className="font-heading text-3xl leading-[1.1] sm:text-4xl lg:text-5xl">
                    {title}
                  </h2>
                </MotionReveal>
                <MotionReveal amount={0.2} delay={0.5} duration={1.45} y={18}>
                  <p className="max-w-2xl text-base leading-relaxed text-[#222] sm:text-lg">
                    {description || 'Описание этого экрана пока не заполнено.'}
                  </p>
                </MotionReveal>
              </div>
              <MotionReveal amount={0.2} delay={0.92} duration={1.3} y={18}>
                <div className="flex flex-wrap gap-3">
                  {hasPrimaryAction ? (
                    <Button asChild>
                      <Link href={primaryHref}>{primaryButtonLabel}</Link>
                    </Button>
                  ) : null}
                </div>
              </MotionReveal>
            </div>

            <div className="flex w-full justify-center">
              <HeroBlobIllustration
                blobImage={image}
                customBlobPositioning={customBlobPositioning}
                kidsImage={kidsImage}
                showBlobBackground={showBlobBackground}
              />
            </div>
          </div>
        </div>
      </PageBlockContainer>
    </PageBlockSection>
  )
}
