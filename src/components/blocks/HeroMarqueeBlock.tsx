import Link from 'next/link'

import type { HeroMarqueeBlock as HeroMarqueeBlockType, Media as MediaType } from '@/payload-types'

import { HeroMarqueeImages } from './HeroMarqueeImages.client'
import { MotionReveal } from '@/components/shared/MotionReveal'
import { PageBlockContainer, PageBlockSection } from '@/components/shared/PageBlock'
import { MagneticText } from '@/components/ui/magnetic-text'
import { cn } from '@/utilities/ui'

type HeroMarqueeBlockProps = HeroMarqueeBlockType & {
  fullScreen?: boolean
}

const HERO_ACTION_TEXT_CLASS_NAME = 'font-heading text-sm sm:text-base lg:text-lg'
const HERO_ACTION_LINK_BASE_CLASS_NAME =
  'relative inline-flex whitespace-nowrap py-3'
const HERO_ACTION_LINK_CLASS_NAME = `${HERO_ACTION_LINK_BASE_CLASS_NAME} px-4 sm:px-6`
const HERO_PRIMARY_ACTION_LINK_CLASS_NAME =
  `${HERO_ACTION_LINK_BASE_CLASS_NAME} pl-4 pr-3 sm:pl-6 sm:pr-4`
const HERO_SECONDARY_ACTION_LINK_CLASS_NAME =
  `${HERO_ACTION_LINK_BASE_CLASS_NAME} pl-3 pr-4 sm:pl-4 sm:pr-6`

export function HeroMarqueeBlock({
  title,
  description,
  primaryButtonLabel,
  primaryButtonLink,
  secondaryButtonLabel,
  secondaryButtonLink,
  images,
  fullScreen = false,
}: HeroMarqueeBlockProps) {
  const galleryImages = (images ?? []).filter(
    (image): image is MediaType => typeof image === 'object' && image !== null,
  )
  const primaryAction =
    primaryButtonLabel && primaryButtonLink
      ? { href: primaryButtonLink, label: primaryButtonLabel }
      : null
  const secondaryAction =
    secondaryButtonLabel && secondaryButtonLink
      ? { href: secondaryButtonLink, label: secondaryButtonLabel }
      : null

  return (
    <PageBlockSection
      className={cn('py-10 sm:py-14 lg:py-20', fullScreen && 'flex flex-col')}
      style={
        fullScreen
          ? {
              minHeight:
                'calc(100dvh - var(--site-header-height) - var(--site-secondary-header-height, 0px))',
            }
          : undefined
      }
    >
      <PageBlockContainer
        className={cn(
          'flex w-full flex-col items-center justify-center gap-10 text-center sm:gap-14',
          fullScreen && 'flex-1',
        )}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5">
          <MotionReveal allowMobileMotion amount={0.12} delay={0.1} duration={0.6} y={18}>
            <h1 className="max-w-4xl font-heading text-3xl leading-[1.1] sm:text-4xl lg:text-5xl">
              {title}
            </h1>
          </MotionReveal>

          {description ? (
            <MotionReveal allowMobileMotion amount={0.12} delay={0.22} duration={0.55} y={16}>
              <p className="max-w-xl text-sm leading-relaxed text-foreground/80 sm:text-base">
                {description}
              </p>
            </MotionReveal>
          ) : null}

          {primaryAction || secondaryAction ? (
            <div className="flex justify-center py-3 sm:py-4">
              <div className="inline-flex max-w-full items-center overflow-hidden rounded-full border border-border bg-white shadow-shadow">
                {primaryAction ? (
                  <MotionReveal allowMobileMotion amount={0.12} delay={0.32} duration={0.5} y={14}>
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
                  <span aria-hidden className="h-6 w-px shrink-0 bg-border" />
                ) : null}
                {secondaryAction ? (
                  <MotionReveal allowMobileMotion amount={0.12} delay={0.44} duration={0.5} y={14}>
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
            </div>
          ) : null}
        </div>

        {galleryImages.length > 0 ? (
          <HeroMarqueeImages
            className="-mt-5 w-screen max-w-none sm:-mt-9"
            images={galleryImages}
          />
        ) : null}
      </PageBlockContainer>
    </PageBlockSection>
  )
}
