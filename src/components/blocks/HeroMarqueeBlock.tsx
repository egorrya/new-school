'use client'

import Link from 'next/link'
import { useLayoutEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import type {
  HeroMarqueeBlock as HeroMarqueeBlockType,
  Media as MediaType,
  News,
} from '@/payload-types'

import { HeroMarqueeImages } from './HeroMarqueeImages.client'
import { LatestNewsLink } from './LatestNewsLink'
import { MotionReveal } from '@/components/shared/MotionReveal'
import { PageBlockContainer, PageBlockSection } from '@/components/shared/PageBlock'
import { MagneticText } from '@/components/ui/magnetic-text'
import { cn } from '@/utilities/ui'
import { useIsMobileViewport } from '@/utilities/useIsMobileViewport'

type HeroMarqueeBlockProps = HeroMarqueeBlockType & {
  fullScreen?: boolean
  latestNews?: News | null
  marqueeImages?: MediaType[]
}

const HERO_ACTION_TEXT_CLASS_NAME = 'font-heading text-xs min-[23rem]:text-sm lg:text-base'
const HERO_ACTION_LINK_BASE_CLASS_NAME =
  'relative inline-flex overflow-hidden whitespace-nowrap py-3'
const HERO_ACTION_LINK_CLASS_NAME = `${HERO_ACTION_LINK_BASE_CLASS_NAME} px-5 sm:px-7`
const HERO_PRIMARY_ACTION_LINK_CLASS_NAME = `${HERO_ACTION_LINK_BASE_CLASS_NAME} pl-5 pr-4 sm:pl-7 sm:pr-5`
const HERO_SECONDARY_ACTION_LINK_CLASS_NAME = `${HERO_ACTION_LINK_BASE_CLASS_NAME} pl-4 pr-5 sm:pl-5 sm:pr-7`
const MOBILE_HERO_MEDIA_QUERY = '(width < 40rem)'
const LATEST_NEWS_REVEAL_DELAY = 2.2
const hiddenNewsClipPath = 'polygon(0 0, 0 0, 0 100%, 0 100%)'
const visibleNewsClipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'

function getViewportWidth() {
  return document.documentElement.clientWidth || window.innerWidth
}

function useStableMobileHeroHeight(enabled: boolean) {
  const [stableHeight, setStableHeight] = useState<string | null>(null)

  useLayoutEffect(() => {
    if (!enabled) {
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

export function HeroMarqueeBlock({
  title,
  description,
  primaryButtonLabel,
  primaryButtonLink,
  secondaryButtonLabel,
  secondaryButtonLink,
  marqueeImages = [],
  fullScreen = false,
  latestNews,
}: HeroMarqueeBlockProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const isMobile = useIsMobileViewport()
  const stableMobileHeroHeight = useStableMobileHeroHeight(fullScreen)
  const galleryImages = marqueeImages
  const primaryAction =
    primaryButtonLabel && primaryButtonLink
      ? { href: primaryButtonLink, label: primaryButtonLabel }
      : null
  const secondaryAction =
    secondaryButtonLabel && secondaryButtonLink
      ? { href: secondaryButtonLink, label: secondaryButtonLabel }
      : null
  const latestNewsRevealDelay =
    galleryImages.length > 0 ? LATEST_NEWS_REVEAL_DELAY : 1.1
  const shouldUseNewsClipReveal = !isMobile && !shouldReduceMotion
  const latestNewsLink = latestNews?.slug ? (
    <LatestNewsLink slug={latestNews.slug} title={latestNews.title} />
  ) : null

  return (
    <PageBlockSection
      className={cn('py-10 sm:py-14 lg:py-20', fullScreen && 'flex flex-col')}
      style={
        fullScreen
          ? {
              minHeight: stableMobileHeroHeight
                ? `calc(${stableMobileHeroHeight} - var(--site-header-height) - var(--site-secondary-header-height, 0px))`
                : 'calc(100dvh - var(--site-header-height) - var(--site-secondary-header-height, 0px))',
            }
          : undefined
      }
    >
      <PageBlockContainer
        className={cn(
          'relative flex w-full flex-col items-start justify-center gap-10 text-left sm:items-center sm:gap-14 sm:text-center',
          fullScreen && 'flex-1',
        )}
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-5 sm:items-center">
          {latestNews?.slug ? (
            <div className="w-full lg:absolute lg:bottom-full lg:left-1/2 lg:mb-4 lg:w-auto lg:-translate-x-1/2">
              {shouldUseNewsClipReveal ? (
                <motion.div
                  animate={{ clipPath: visibleNewsClipPath }}
                  className="w-full lg:w-auto"
                  initial={{ clipPath: hiddenNewsClipPath }}
                  style={{ willChange: 'clip-path' }}
                  transition={{
                    clipPath: {
                      delay: latestNewsRevealDelay,
                      duration: 2.15,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  }}
                >
                  {latestNewsLink}
                </motion.div>
              ) : (
                <MotionReveal
                  allowMobileMotion
                  amount={0.12}
                  className="w-full lg:w-auto"
                  delay={latestNewsRevealDelay}
                  duration={0.5}
                  y={14}
                >
                  {latestNewsLink}
                </MotionReveal>
              )}
            </div>
          ) : null}

          <h1
            className="hero-heading-reveal max-w-4xl font-heading text-2xl leading-[1.1] sm:text-4xl lg:text-5xl"
            style={{ animationDelay: latestNews?.slug ? '100ms' : undefined }}
          >
            {title}
          </h1>

          {description ? (
            <MotionReveal
              allowMobileMotion
              amount={0.12}
              delay={latestNews?.slug ? 0.22 : 0.12}
              duration={0.55}
              y={16}
            >
              <p className="max-w-xl text-xs leading-relaxed text-foreground/80 sm:text-base">
                {description}
              </p>
            </MotionReveal>
          ) : null}

          {primaryAction || secondaryAction ? (
            <div className="flex w-full justify-start sm:justify-center">
              <MotionReveal
                allowMobileMotion
                amount={0.12}
                delay={latestNews?.slug ? 0.32 : 0.22}
                duration={0.4}
                y={12}
              >
                <div className="inline-flex max-w-full items-center overflow-hidden rounded-full border border-border bg-white shadow-shadow">
                  {primaryAction ? (
                    <MotionReveal
                      allowMobileMotion
                      amount={0.12}
                      delay={0.52}
                      duration={0.4}
                      y={14}
                    >
                      <Link
                        className={
                          secondaryAction
                            ? HERO_PRIMARY_ACTION_LINK_CLASS_NAME
                            : HERO_ACTION_LINK_CLASS_NAME
                        }
                        href={primaryAction.href}
                      >
                        <MagneticText
                          hoverText={primaryAction.label}
                          text={primaryAction.label}
                          textClassName={HERO_ACTION_TEXT_CLASS_NAME}
                        />
                      </Link>
                    </MotionReveal>
                  ) : null}
                  {primaryAction && secondaryAction ? (
                    <span aria-hidden className="shrink-0 self-stretch border-l border-border" />
                  ) : null}
                  {secondaryAction ? (
                    <MotionReveal
                      allowMobileMotion
                      amount={0.12}
                      delay={0.66}
                      duration={0.4}
                      y={14}
                    >
                      <Link
                        className={
                          primaryAction
                            ? HERO_SECONDARY_ACTION_LINK_CLASS_NAME
                            : HERO_ACTION_LINK_CLASS_NAME
                        }
                        href={secondaryAction.href}
                      >
                        <MagneticText
                          hoverText={secondaryAction.label}
                          text={secondaryAction.label}
                          textClassName={HERO_ACTION_TEXT_CLASS_NAME}
                        />
                      </Link>
                    </MotionReveal>
                  ) : null}
                </div>
              </MotionReveal>
            </div>
          ) : null}
        </div>

        {galleryImages.length > 0 ? (
          <HeroMarqueeImages
            className="-mt-5 -mx-4 w-screen max-w-none sm:-mt-9 sm:mx-0"
            images={galleryImages}
          />
        ) : null}
      </PageBlockContainer>
    </PageBlockSection>
  )
}
