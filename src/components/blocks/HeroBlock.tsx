import type { HeroBlock as HeroBlockType } from '@/payload-types'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { PageBlockContainer, PageBlockSection } from '@/components/shared/PageBlock'

import { cn } from '@/utilities/ui'

function HeroBlobIllustration() {
  return (
    <div className="pointer-events-none relative aspect-[4/5] overflow-hidden lg:aspect-[5/6]">
      <svg
        aria-hidden="true"
        className="h-full w-full"
        fill="none"
        viewBox="0 0 820 660"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hero-blob-fill" x1="160" x2="700" y1="56" y2="610" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F8FBFF" />
            <stop offset="0.58" stopColor="#DDE8FF" />
            <stop offset="1" stopColor="#C3D4F7" />
          </linearGradient>
          <radialGradient id="hero-blob-highlight" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(240 120) rotate(38) scale(470 430)">
            <stop stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0.18" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <filter id="hero-blob-shadow" x="0" y="0" width="820" height="660" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur in="SourceAlpha" stdDeviation="16" result="blur" />
            <feOffset dy="18" />
            <feComposite in2="blur" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix values="0 0 0 0 0.45 0 0 0 0 0.51 0 0 0 0 0.64 0 0 0 0.22 0" />
          </filter>
        </defs>

        <g filter="url(#hero-blob-shadow)">
          <path
            d="M150 121C160 72 214 40 271 45C311 10 371 20 403 56C450 16 520 9 574 50C620 25 679 39 705 95C756 112 780 169 766 224C798 276 787 347 748 384C764 441 735 501 678 523C637 575 558 585 500 572C451 621 368 622 318 578C250 594 174 557 146 499C94 489 53 440 52 380C19 342 19 276 47 241C39 183 74 134 150 121Z"
            fill="url(#hero-blob-fill)"
          />
        </g>

        <path
          d="M150 121C160 72 214 40 271 45C311 10 371 20 403 56C450 16 520 9 574 50C620 25 679 39 705 95C756 112 780 169 766 224C798 276 787 347 748 384C764 441 735 501 678 523C637 575 558 585 500 572C451 621 368 622 318 578C250 594 174 557 146 499C94 489 53 440 52 380C19 342 19 276 47 241C39 183 74 134 150 121Z"
          fill="url(#hero-blob-fill)"
        />

        <path
          d="M150 121C160 72 214 40 271 45C311 10 371 20 403 56C450 16 520 9 574 50C620 25 679 39 705 95C756 112 780 169 766 224C798 276 787 347 748 384C764 441 735 501 678 523C637 575 558 585 500 572C451 621 368 622 318 578C250 594 174 557 146 499C94 489 53 440 52 380C19 342 19 276 47 241C39 183 74 134 150 121Z"
          fill="url(#hero-blob-highlight)"
          opacity="0.95"
        />

        <ellipse cx="408" cy="602" fill="#9BACCC" fillOpacity="0.4" rx="298" ry="46" />
      </svg>
    </div>
  )
}

export function HeroBlock({
  title,
  description,
  primaryButtonLabel,
  primaryButtonLink,
}: HeroBlockType) {
  const hasPrimaryAction = Boolean(primaryButtonLabel && primaryButtonLink)
  const primaryHref = primaryButtonLink || '/'

  return (
    <PageBlockSection className="pt-6 sm:pt-10 lg:pt-14">
      <PageBlockContainer>
        <div className="relative overflow-hidden">
          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] lg:items-center lg:p-10">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="max-w-3xl font-heading text-4xl leading-[0.92] sm:text-5xl lg:text-6xl">
                  {title}
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-lg">
                  {description || 'Описание этого экрана пока не заполнено.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {hasPrimaryAction ? (
                  <Button
                    asChild
                    className={cn(
                      'motion-reduce:transition-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0',
                    )}
                  >
                    <Link href={primaryHref}>{primaryButtonLabel}</Link>
                  </Button>
                ) : null}
              </div>
            </div>

            <HeroBlobIllustration />
          </div>
        </div>
      </PageBlockContainer>
    </PageBlockSection>
  )
}
