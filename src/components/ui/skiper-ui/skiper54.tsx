"use client"

import Autoplay from "embla-carousel-autoplay"
import { motion } from "motion/react"
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react"
import React, { useEffect, useMemo, useRef, useState } from "react"

import type { Media as MediaDocument } from "@/payload-types"

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Media } from "@/components/shared/Media"
import { cn } from "@/utilities/ui"

export type Skiper54Slide = {
  id: string
  image: MediaDocument
  albumTitle?: string | null
  title?: string | null
}

type Skiper54Props = {
  slides?: Skiper54Slide[]
  className?: string
  autoplay?: boolean
  loop?: boolean
  showNavigation?: boolean
  showPagination?: boolean
}

const getSlideAspectRatio = (image: MediaDocument) => {
  const width = typeof image.width === "number" && image.width > 0 ? image.width : null
  const height = typeof image.height === "number" && image.height > 0 ? image.height : null

  return width && height ? width / height : 4 / 3
}

const normalizeSlideIndex = (index: number, slideCount: number) =>
  ((index % slideCount) + slideCount) % slideCount

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const activeSlideRadius = 24
const inactiveSlideRadius = 18
const inactiveSlideInset = 15
const inactiveSlideScale = 0.985

const areProgressValuesEqual = (a: number[], b: number[]) =>
  a.length === b.length && a.every((value, index) => Math.abs(value - b[index]) < 0.01)

const Skiper54 = ({
  slides = [],
  className,
  autoplay = false,
  loop = true,
  showNavigation = true,
  showPagination = true,
}: Skiper54Props) => {
  const visibleSlides = slides.filter((slide) => slide.image?.url || slide.image?.filename)

  if (visibleSlides.length === 0) {
    return (
      <div
        className={cn(
          "flex min-h-[320px] w-full items-center justify-center rounded-base border border-dashed border-border bg-secondary-background p-6 text-center",
          className,
        )}
      >
        <div className="max-w-sm space-y-3">
          <ImageOff className="mx-auto h-10 w-10 text-foreground/50" aria-hidden="true" />
          <div>
            <p className="font-heading text-xl leading-tight">Фотографии пока не добавлены</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70">
              Добавьте изображения в альбом галереи в Payload, чтобы они появились в слайдере.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Carousel006
      autoplay={autoplay}
      className={className}
      loop={loop && visibleSlides.length > 1}
      showNavigation={showNavigation}
      showPagination={showPagination}
      slides={visibleSlides}
    />
  )
}

type Carousel006Props = {
  slides: Skiper54Slide[]
  className?: string
  autoplay?: boolean
  loop?: boolean
  showNavigation?: boolean
  showPagination?: boolean
}

const Carousel006 = ({
  slides,
  className,
  autoplay = false,
  loop = true,
  showNavigation = true,
  showPagination = true,
}: Carousel006Props) => {
  const useBufferedLoop = loop && slides.length > 1
  const initialSnap = useBufferedLoop ? slides.length : 0
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(initialSnap)
  const [shouldLoadMedia, setShouldLoadMedia] = useState(false)
  const [slideProgresses, setSlideProgresses] = useState<number[]>([])
  const canNavigate = slides.length > 1
  const activeIndex = useBufferedLoop
    ? normalizeSlideIndex(current, slides.length)
    : Math.min(current, slides.length - 1)

  const carouselSlides = useMemo(() => {
    if (!useBufferedLoop) {
      return slides.map((slide, index) => ({
        slide,
        originalIndex: index,
        key: slide.id,
      }))
    }

    return [...slides, ...slides, ...slides].map((slide, index) => {
      const segmentIndex = Math.floor(index / slides.length)

      return {
        slide,
        originalIndex: index % slides.length,
        key: `${slide.id}-${segmentIndex}-${index}`,
      }
    })
  }, [slides, useBufferedLoop])

  const plugins = useMemo(
    () =>
      autoplay && canNavigate
        ? [
            Autoplay({
              delay: 3000,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
          ]
        : [],
    [autoplay, canNavigate],
  )

  useEffect(() => {
    const root = rootRef.current

    if (!root || shouldLoadMedia) return

    if (typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() => {
        setShouldLoadMedia(true)
      })

      return () => {
        window.cancelAnimationFrame(frame)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return

        setShouldLoadMedia(true)
        observer.disconnect()
      },
      {
        rootMargin: "600px 0px",
      },
    )

    observer.observe(root)

    return () => {
      observer.disconnect()
    }
  }, [shouldLoadMedia])

  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      const selectedSnap = api.selectedScrollSnap()

      setCurrent(selectedSnap)
    }

    onSelect()
    api.on("select", onSelect)
    api.on("reInit", onSelect)

    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api, slides.length, useBufferedLoop])

  useEffect(() => {
    if (!api) return

    let frame = 0

    const updateSlideProgresses = () => {
      frame = 0

      const rootRect = api.rootNode().getBoundingClientRect()
      const rootCenter = rootRect.left + rootRect.width / 2
      const threshold = rootRect.width * 0.36

      const nextProgresses = api.slideNodes().map((slideNode) => {
        const slideRect = slideNode.getBoundingClientRect()
        const slideCenter = slideRect.left + slideRect.width / 2
        const distanceFromCenter = Math.abs(slideCenter - rootCenter)

        return clamp(1 - distanceFromCenter / threshold, 0, 1)
      })

      setSlideProgresses((previousProgresses) =>
        areProgressValuesEqual(previousProgresses, nextProgresses)
          ? previousProgresses
          : nextProgresses,
      )
    }

    const scheduleUpdate = () => {
      if (frame) return

      frame = window.requestAnimationFrame(updateSlideProgresses)
    }

    scheduleUpdate()
    api.on("scroll", scheduleUpdate)
    api.on("select", scheduleUpdate)
    api.on("settle", scheduleUpdate)
    api.on("reInit", scheduleUpdate)

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame)
      }

      api.off("scroll", scheduleUpdate)
      api.off("select", scheduleUpdate)
      api.off("settle", scheduleUpdate)
      api.off("reInit", scheduleUpdate)
    }
  }, [api])

  const scrollToSlide = (index: number) => {
    if (!api) return

    if (!useBufferedLoop) {
      api.scrollTo(index)
      return
    }

    const candidates = [index, index + slides.length, index + slides.length * 2]
    const nearestSnap = candidates.reduce((nearest, candidate) =>
      Math.abs(candidate - current) < Math.abs(nearest - current) ? candidate : nearest,
    )

    api.scrollTo(nearestSnap)
  }

  return (
    <Carousel
      ref={rootRef}
      setApi={setApi}
      className={cn("relative left-1/2 w-screen -translate-x-1/2 overflow-hidden pb-10", className)}
      opts={{
        align: "center",
        containScroll: false,
        loop: useBufferedLoop,
        slidesToScroll: 1,
        startIndex: initialSnap,
      }}
      plugins={plugins}
    >
      <CarouselContent className="ml-0 h-[clamp(280px,45svh,480px)] w-full gap-0 sm:h-[clamp(500px,70svh,780px)] lg:h-[clamp(560px,72svh,860px)]">
        {carouselSlides.map(({ slide, originalIndex, key }, index) => {
          const title = slide.title || slide.albumTitle || "Фотография галереи"
          const isActive = current === index
          const aspectRatio = getSlideAspectRatio(slide.image)
          const slideProgress = slideProgresses[index] ?? (isActive ? 1 : 0)
          const borderRadius =
            inactiveSlideRadius + (activeSlideRadius - inactiveSlideRadius) * slideProgress
          const clipInset = inactiveSlideInset * (1 - slideProgress)
          const scale = inactiveSlideScale + (1 - inactiveSlideScale) * slideProgress

          return (
            <CarouselItem
              key={key}
              className="relative mr-4 flex h-[90%] basis-auto items-center justify-center pl-0"
              data-gallery-photo-slide
            >
              <motion.button
                aria-label={`Перейти к слайду ${originalIndex + 1}`}
                className={cn(
                  "h-full max-w-[calc(100vw-3rem)] overflow-hidden border-0 bg-secondary-background p-0 shadow-shadow will-change-[border-radius,clip-path,transform]",
                  canNavigate && "cursor-pointer",
                )}
                initial={false}
                onClick={() => scrollToSlide(originalIndex)}
                style={{
                  aspectRatio,
                  borderRadius,
                  clipPath: `inset(${clipInset}% 0% ${clipInset}% 0% round ${borderRadius}px)`,
                  scale,
                }}
                type="button"
              >
                <div className="relative h-full w-full">
                  {shouldLoadMedia ? (
                    <Media
                      alt={slide.image.alt || title}
                      fill
                      htmlElement={null}
                      imgClassName="h-full w-full scale-105 object-cover"
                      loading="eager"
                      pictureClassName="relative block h-full w-full"
                      priority={index === initialSnap}
                      resource={slide.image}
                      size="(max-width: 640px) 76vw, (max-width: 768px) 52vw, (max-width: 1024px) 34vw, (max-width: 1280px) 27vw, 23vw"
                      videoClassName="absolute inset-0 h-full w-full scale-105 object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-secondary-background" />
                  )}
                </div>
              </motion.button>
            </CarouselItem>
          )
        })}
      </CarouselContent>

      {(showNavigation || showPagination) && canNavigate && (
        <div className="mt-5 flex w-full items-center justify-center gap-3 px-4">
          {showNavigation && (
            <Button
              aria-label="Предыдущий слайд"
              className="h-9 w-9 shrink-0 cursor-pointer bg-black text-white shadow-none hover:shadow-none"
              onClick={() => api?.scrollPrev()}
              size="icon"
              type="button"
              variant="noShadow"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </Button>
          )}

          {showPagination && (
            <div className="flex min-w-0 items-center justify-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  aria-label={`Перейти к слайду ${index + 1}`}
                  className={cn(
                    "h-2.5 w-2.5 shrink-0 cursor-pointer rounded-full border border-border transition-all",
                    activeIndex === index ? "w-7 bg-black" : "bg-secondary-background",
                  )}
                  onClick={() => scrollToSlide(index)}
                  type="button"
                />
              ))}
            </div>
          )}

          {showNavigation && (
            <Button
              aria-label="Следующий слайд"
              className="h-9 w-9 shrink-0 cursor-pointer bg-black text-white shadow-none hover:shadow-none"
              onClick={() => api?.scrollNext()}
              size="icon"
              type="button"
              variant="noShadow"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          )}
        </div>
      )}
    </Carousel>
  )
}

export { Skiper54 }
