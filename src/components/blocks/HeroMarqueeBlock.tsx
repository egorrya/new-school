import Link from 'next/link'

import type { HeroMarqueeBlock as HeroMarqueeBlockType, Media as MediaType } from '@/payload-types'

import { Button } from '@/components/ui/button'
import { HeroMarqueeImages } from './HeroMarqueeImages.client'
import { MotionReveal } from '@/components/shared/MotionReveal'
import { PageBlockContainer, PageBlockSection } from '@/components/shared/PageBlock'
import { cn } from '@/utilities/ui'

type HeroMarqueeBlockProps = HeroMarqueeBlockType & {
  fullScreen?: boolean
}

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
  const hasPrimaryAction = Boolean(primaryButtonLabel && primaryButtonLink)
  const hasSecondaryAction = Boolean(secondaryButtonLabel && secondaryButtonLink)

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

          {hasPrimaryAction || hasSecondaryAction ? (
            <div className="flex flex-wrap items-center justify-center gap-5">
              {hasPrimaryAction ? (
                <MotionReveal allowMobileMotion amount={0.12} delay={0.32} duration={0.5} y={14}>
                  <Button asChild>
                    <Link href={primaryButtonLink || '/'}>{primaryButtonLabel}</Link>
                  </Button>
                </MotionReveal>
              ) : null}
              {hasSecondaryAction ? (
                <MotionReveal allowMobileMotion amount={0.12} delay={0.44} duration={0.5} y={14}>
                  <Button
                    asChild
                    className="h-auto px-0 py-1 sm:h-auto sm:px-0"
                    variant="link"
                  >
                    <Link href={secondaryButtonLink || '/'}>{secondaryButtonLabel}</Link>
                  </Button>
                </MotionReveal>
              ) : null}
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
