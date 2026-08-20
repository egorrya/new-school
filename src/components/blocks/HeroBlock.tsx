'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLayoutEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { MotionReveal } from '@/components/shared/MotionReveal'

import type { HeroBlock as HeroBlockType, News } from '@/payload-types'

import { HeroBlobIllustration } from './HeroBlobIllustration'
import { Button } from '@/components/ui/button'

import { PageBlockContainer, PageBlockSection } from '@/components/shared/PageBlock'

import { cn } from '@/utilities/ui'

type HeroBlockProps = HeroBlockType & {
  fullScreen?: boolean
  latestNews?: News | null
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
  secondaryButtonLabel,
  secondaryButtonLink,
  fullScreen = false,
  latestNews,
}: HeroBlockProps) {
  const hasPrimaryAction = Boolean(primaryButtonLabel && primaryButtonLink)
  const primaryHref = primaryButtonLink || '/'
  const hasSecondaryAction = Boolean(secondaryButtonLabel && secondaryButtonLink)
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
              'mobile-standard-text-scale-75 relative grid w-full items-center gap-5 px-0 py-4 sm:gap-8 sm:p-6 lg:p-8',
              fullScreen
                ? 'pt-12 sm:pt-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,1.05fr)] lg:gap-10'
                : 'lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,1.05fr)]',
            )}
          >
            <div className={cn('space-y-4 sm:space-y-6', fullScreen && 'max-w-3xl')}>
              <div className="space-y-4 sm:space-y-6">
                {latestNews?.slug ? (
                  <MotionReveal allowMobileMotion amount={0.12} duration={0.5} y={14}>
                    <Link
                      aria-label={`Открыть новость: ${latestNews.title}`}
                      className="group relative isolate flex w-full max-w-full items-center gap-2.5 overflow-hidden rounded-base border border-foreground bg-foreground px-3 py-0 text-background shadow-shadow transition-colors duration-200 after:pointer-events-none after:absolute after:inset-y-0 after:-left-1/2 after:z-0 after:w-1/3 after:-skew-x-12 after:bg-linear-to-r after:from-transparent after:via-white/20 after:to-transparent after:transition-transform after:duration-700 after:content-[''] hover:bg-foreground hover:text-background hover:after:translate-x-[450%] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 group-focus-visible:bg-foreground group-focus-visible:text-background group-focus-visible:after:translate-x-[450%] motion-reduce:after:transition-none sm:w-fit sm:max-w-xl"
                      href={`/news/${latestNews.slug}`}
                    >
                      <span className="pointer-events-none relative z-10 size-10 shrink-0 overflow-hidden">
                        <Image
                          alt=""
                          aria-hidden="true"
                          className="origin-center object-contain scale-[2] translate-y-1.5"
                          fill
                          loading="eager"
                          sizes="2.5rem"
                          src="/hero/ornaments/stars.svg"
                          unoptimized
                        />
                      </span>
                      <span className="relative z-10 min-w-0 text-left">
                        <span className="block text-pretty text-[calc(var(--text-xs)*0.9)] font-base leading-snug text-background sm:text-xs">
                          {latestNews.title}
                        </span>
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="relative z-10 size-3.5 shrink-0 -translate-x-1 text-background transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5 motion-reduce:transition-none"
                      />
                    </Link>
                  </MotionReveal>
                ) : null}
                <MotionReveal
                  allowMobileMotion
                  amount={0.12}
                  delay={latestNews?.slug ? 0.1 : 0}
                  duration={0.7}
                  y={18}
                >
                  <h2 className="font-heading text-[1.5rem] leading-[1.1] whitespace-pre-line sm:text-[2rem] lg:text-[2.75rem]">
                    {title}
                  </h2>
                </MotionReveal>
                <MotionReveal
                  allowMobileMotion
                  amount={0.12}
                  delay={latestNews?.slug ? 0.24 : 0.14}
                  duration={0.6}
                  y={18}
                >
                  <p className="max-w-2xl text-base leading-relaxed text-black sm:text-lg">
                    {description || 'Описание этого экрана пока не заполнено.'}
                  </p>
                </MotionReveal>
              </div>
              <MotionReveal
                allowMobileMotion
                amount={0.12}
                delay={latestNews?.slug ? 0.4 : 0.3}
                duration={0.55}
                y={18}
              >
                <div className="flex flex-wrap items-center gap-5">
                  {hasPrimaryAction ? (
                    <Button asChild>
                      <Link href={primaryHref}>{primaryButtonLabel}</Link>
                    </Button>
                  ) : null}
                  {hasSecondaryAction ? (
                    <Button asChild className="h-auto px-0 py-1 sm:h-auto sm:px-0" variant="link">
                      <Link href={secondaryButtonLink || '/'}>{secondaryButtonLabel}</Link>
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
