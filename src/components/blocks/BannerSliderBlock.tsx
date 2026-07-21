import type { BannerSliderBlock as BannerSliderBlockType } from '@/payload-types'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

import { MediaFrame } from '@/components/shared/MediaFrame'
import { PageBlockContainer, PageBlockEmptyState, PageBlockSection } from '@/components/shared/PageBlock'

import { cn } from '@/utilities/ui'

export function BannerSliderBlock({ slides }: BannerSliderBlockType) {
  const bannerSlides = slides ?? []

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <div className="overflow-visible">
          {bannerSlides.length > 0 ? (
            <div className="relative">
              <Carousel className="w-full" opts={{ loop: bannerSlides.length > 1 }}>
                <CarouselContent className="ml-0">
                  {bannerSlides.map((slide, index) => {
                    const hasButton = Boolean(slide.buttonLabel && slide.buttonLink)

                    return (
                      <CarouselItem key={slide.id || `${slide.title}-${index}`}>
                        <article className="grid gap-6 rounded-base border-2 border-border bg-card p-5 shadow-shadow sm:p-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] lg:items-center lg:p-8">
                          <div className="space-y-4">
                            <div className="space-y-3">
                              <h2 className="max-w-2xl font-heading text-2xl leading-tight sm:text-3xl">
                                {slide.title}
                              </h2>
                              <p className="max-w-2xl text-sm leading-relaxed text-foreground/80 sm:text-base">
                                {slide.description || 'Описание слайда пока не добавлено.'}
                              </p>
                            </div>
                            {hasButton ? (
                              <div>
                                <Button
                                  asChild
                                  className={cn(
                                    'motion-reduce:transition-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0',
                                  )}
                                  size="lg"
                                >
                                  <Link href={slide.buttonLink || '#'}>{slide.buttonLabel}</Link>
                                </Button>
                              </div>
                            ) : null}
                          </div>

                          <MediaFrame
                            alt={slide.title}
                            aspectClassName="aspect-[16/10] sm:aspect-[4/3] lg:aspect-[5/4]"
                            className="bg-background"
                            resource={slide.image}
                          />
                        </article>
                      </CarouselItem>
                    )
                  })}
                </CarouselContent>

                {bannerSlides.length > 1 ? (
                  <>
                    <CarouselPrevious className="hidden lg:inline-flex" />
                    <CarouselNext className="hidden lg:inline-flex" />
                  </>
                ) : null}
              </Carousel>
            </div>
          ) : (
            <PageBlockEmptyState
              description="Добавьте хотя бы один баннер, чтобы показать слайдер на странице."
              title="Слайды пока не добавлены"
            />
          )}
        </div>
      </PageBlockContainer>
    </PageBlockSection>
  )
}
