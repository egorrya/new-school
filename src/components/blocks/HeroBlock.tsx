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
        minHeight: '100dvh',
        marginTop:
          'calc(-1 * (var(--site-header-height, 0px) + var(--site-secondary-header-height, 0px)))',
      }
    : undefined

  return (
    <PageBlockSection
      style={fullScreenStyle}
      className={cn(
        'py-0 sm:py-0 lg:py-0',
        fullScreen && 'flex flex-col items-center justify-center',
      )}
    >
      <PageBlockContainer className="w-full">
        <div className="relative w-full overflow-visible">
          <div
            className={cn(
              'relative grid w-full gap-8 p-4 sm:p-6 lg:p-8 items-center',
              fullScreen
                ? 'lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,1.05fr)] lg:gap-10'
                : 'lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,1.05fr)]',
            )}
          >
            <div className={cn('space-y-6', fullScreen && 'max-w-3xl')}>
              <div className="space-y-6">
                <MotionReveal amount={0.2} blur={2} duration={0.7} y={18}>
                  <h2 className="font-heading text-3xl leading-[1.1] sm:text-4xl lg:text-5xl">
                    {title}
                  </h2>
                </MotionReveal>
                <MotionReveal amount={0.2} blur={2} delay={0.14} duration={0.6} y={18}>
                  <p className="max-w-2xl text-base leading-relaxed text-[#222] sm:text-lg">
                    {description || 'Описание этого экрана пока не заполнено.'}
                  </p>
                </MotionReveal>
              </div>
              <MotionReveal amount={0.2} blur={2} delay={0.3} duration={0.55} y={18}>
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
