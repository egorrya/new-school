import Link from 'next/link'

import type {
  HeroMarqueeBlock as HeroMarqueeBlockType,
  Media as MediaType,
  News,
} from '@/payload-types'

import { HeroMarqueeImages } from './Images'
import { LatestNewsLink } from '../HeroBlock/LatestNewsLink'
import { MotionReveal } from '@/shared/components/MotionReveal'
import { PageBlockContainer, PageBlockSection } from '@/shared/components/PageBlock'
import { MagneticText } from '@/shared/ui/primitives/magnetic-text'
import { cn } from '@/shared/lib/cn'

type HeroMarqueeBlockProps = HeroMarqueeBlockType & {
  fullScreen?: boolean
  latestNews?: News | null
  marqueeImages?: MediaType[]
}

const heroActionTextClassName = 'font-heading text-xs min-[23rem]:text-sm lg:text-base'
const heroActionLinkBaseClassName = 'relative inline-flex overflow-hidden whitespace-nowrap py-3'
const heroActionLinkClassName = `${heroActionLinkBaseClassName} px-5 sm:px-7`
const heroPrimaryActionLinkClassName = `${heroActionLinkBaseClassName} pl-5 pr-4 sm:pl-7 sm:pr-5`
const heroSecondaryActionLinkClassName = `${heroActionLinkBaseClassName} pl-4 pr-5 sm:pl-5 sm:pr-7`

/**
 * The first screen is deliberately a Server Component. Its previous client
 * boundary waited for hydration, a timer and a ResizeObserver before the
 * gallery could become visible; that gallery was the mobile LCP element.
 * Decorative interactions remain available elsewhere, while this content is
 * now present and paintable in the initial HTML.
 */
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
          'relative flex w-full flex-col items-start justify-center gap-10 text-left sm:items-center sm:gap-14 sm:text-center',
          fullScreen && 'flex-1',
        )}
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-5 sm:items-center">
          {latestNews?.slug ? (
            <MotionReveal
              allowMobileMotion
              amount={0.12}
              className="w-full lg:absolute lg:bottom-full lg:left-1/2 lg:mb-4 lg:w-auto lg:-translate-x-1/2"
              duration={0.5}
              y={14}
            >
              <LatestNewsLink slug={latestNews.slug} title={latestNews.title} />
            </MotionReveal>
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
              delay={latestNews?.slug ? 0.24 : 0.14}
              duration={0.6}
              y={18}
            >
              <p className="max-w-xl text-xs leading-relaxed text-foreground/80 sm:text-base">
                {description}
              </p>
            </MotionReveal>
          ) : null}

          {primaryAction || secondaryAction ? (
            <MotionReveal
              allowMobileMotion
              amount={0.12}
              delay={latestNews?.slug ? 0.4 : 0.3}
              duration={0.55}
              y={18}
            >
              <div className="flex w-full justify-start sm:justify-center">
                <div className="inline-flex max-w-full items-center overflow-hidden rounded-full border border-border bg-white shadow-shadow">
                  {primaryAction ? (
                    <Link
                      className={
                        secondaryAction ? heroPrimaryActionLinkClassName : heroActionLinkClassName
                      }
                      href={primaryAction.href}
                    >
                      <MagneticText
                        hoverText={primaryAction.label}
                        text={primaryAction.label}
                        textClassName={heroActionTextClassName}
                      />
                    </Link>
                  ) : null}
                  {primaryAction && secondaryAction ? (
                    <span aria-hidden className="shrink-0 self-stretch border-l border-border" />
                  ) : null}
                  {secondaryAction ? (
                    <Link
                      className={
                        primaryAction ? heroSecondaryActionLinkClassName : heroActionLinkClassName
                      }
                      href={secondaryAction.href}
                    >
                      <MagneticText
                        hoverText={secondaryAction.label}
                        text={secondaryAction.label}
                        textClassName={heroActionTextClassName}
                      />
                    </Link>
                  ) : null}
                </div>
              </div>
            </MotionReveal>
          ) : null}
        </div>

        {marqueeImages.length > 0 ? (
          <HeroMarqueeImages
            className="-mt-5 -mx-4 w-screen max-w-none sm:-mt-9 sm:mx-0"
            images={marqueeImages}
          />
        ) : null}
      </PageBlockContainer>
    </PageBlockSection>
  )
}
