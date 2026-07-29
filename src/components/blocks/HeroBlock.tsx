'use client'

import Link from 'next/link'
import { useLayoutEffect, useState } from 'react'
import { MotionReveal } from '@/components/shared/MotionReveal'

import type { HeroBlock as HeroBlockType } from '@/payload-types'

import { HeroBlobIllustration } from './HeroBlobIllustration'
import { Button } from '@/components/ui/button'

import { PageBlockContainer, PageBlockSection } from '@/components/shared/PageBlock'

import { cn } from '@/utilities/ui'

type HeroBlockProps = HeroBlockType & {
  fullScreen?: boolean
}

const MOBILE_HERO_MEDIA_QUERY = '(width < 40rem)'

function getViewportWidth() {
  return document.documentElement.clientWidth || window.innerWidth
}

function useStableMobileHeroHeight(enabled: boolean) {
  const [stableHeight, setStableHeight] = useState<string | null>(null)

  useLayoutEffect(() => {
    if (!enabled) {
      setStableHeight(null)
      return
    }

    const mobileQuery = window.matchMedia(MOBILE_HERO_MEDIA_QUERY)
    let lastWidth = getViewportWidth()

    const updateHeight = () => {
      setStableHeight(mobileQuery.matches ? `${window.innerHeight}px` : null)
    }

    const handleResize = () => {
      const nextWidth = getViewportWidth()

      if (!mobileQuery.matches) {
        lastWidth = nextWidth
        setStableHeight(null)
        return
      }

      if (Math.abs(nextWidth - lastWidth) >= 1) {
        lastWidth = nextWidth
        updateHeight()
      }
    }

    const handleQueryChange = () => {
      lastWidth = getViewportWidth()
      updateHeight()
    }

    updateHeight()
    window.addEventListener('resize', handleResize)
    mobileQuery.addEventListener('change', handleQueryChange)

    return () => {
      window.removeEventListener('resize', handleResize)
      mobileQuery.removeEventListener('change', handleQueryChange)
    }
  }, [enabled])

  return stableHeight
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
  const stableMobileHeroHeight = useStableMobileHeroHeight(fullScreen)
  const fullScreenStyle = fullScreen
    ? {
        minHeight: stableMobileHeroHeight ?? '100dvh',
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
        <div className="relative w-full overflow-x-clip">
          <div
            className={cn(
              'mobile-standard-text-scale-75 relative grid w-full items-center gap-5 p-4 sm:gap-8 sm:p-6 lg:p-8',
              fullScreen
                ? 'lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,1.05fr)] lg:gap-10'
                : 'lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,1.05fr)]',
            )}
          >
            <div className={cn('space-y-4 sm:space-y-6', fullScreen && 'max-w-3xl')}>
              <div className="space-y-4 sm:space-y-6">
                <MotionReveal allowMobileMotion amount={0.2} blur={2} duration={0.7} y={18}>
                  <h2 className="font-heading text-3xl leading-[1.1] sm:text-4xl lg:text-5xl">
                    {title}
                  </h2>
                </MotionReveal>
                <MotionReveal allowMobileMotion amount={0.2} blur={2} delay={0.14} duration={0.6} y={18}>
                  <p className="max-w-2xl text-base leading-relaxed text-[#222] sm:text-lg">
                    {description || 'Описание этого экрана пока не заполнено.'}
                  </p>
                </MotionReveal>
              </div>
              <MotionReveal allowMobileMotion amount={0.2} blur={2} delay={0.3} duration={0.55} y={18}>
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
