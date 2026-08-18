'use client'

import type { Media as MediaType } from '@/payload-types'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'

import { Media } from '@/components/shared/Media'

type ProgramCategoryCardProps = {
  title: string
  description?: null | string
  href: string
  color: string
  previewImage?: MediaType | number | null
  programTitles?: string[]
  showProgramMarquee?: boolean | null
}

export function ProgramCategoryCard({
  color,
  description,
  href,
  previewImage,
  programTitles = [],
  showProgramMarquee = false,
  title,
}: ProgramCategoryCardProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const mediaResource = typeof previewImage === 'object' ? previewImage : null
  const hasProgramMarquee = showProgramMarquee && programTitles.length > 0
  const marqueeItems = [...programTitles, ...programTitles]

  return (
    <motion.div
      animate="rest"
      className="self-start"
      initial="rest"
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      variants={{ hover: { y: 0 }, rest: { y: 0 } }}
      whileHover={shouldReduceMotion ? undefined : 'hover'}
    >
      <Link
        aria-label={title}
        className="group relative flex aspect-video flex-col justify-end overflow-hidden rounded-base p-6 text-white shadow-shadow sm:p-8"
        href={href}
        style={{ backgroundColor: color }}
      >
        {mediaResource ? (
          <Media
            alt={title}
            fill
            htmlElement={null}
            imgClassName="h-full w-full object-cover"
            pictureClassName="absolute inset-0 block h-full w-full"
            quality={75}
            resource={mediaResource}
            size="(min-width: 640px) 50vw, 100vw"
          />
        ) : null}

        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-black/10"
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-[12%]"
          style={{
            background:
              'radial-gradient(ellipse at 12% 110%, rgba(34, 102, 184, 0.72) 0%, transparent 56%), radial-gradient(ellipse at 96% 4%, rgba(255, 143, 92, 0.48) 0%, transparent 52%)',
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          variants={{
            hover: { opacity: 1, scale: 1, x: 0, y: 0 },
            rest: { opacity: 0, scale: 1.08, x: -18, y: 14 },
          }}
        />

        <div className="relative z-10 flex flex-col justify-end">
          <motion.span
            className="flex items-center justify-between gap-4"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            variants={{ hover: { opacity: 1, y: 0 }, rest: { opacity: 1, y: 0 } }}
          >
            <span className="min-w-0 font-heading text-xl leading-[1.15] font-medium sm:text-2xl">
              {title}
            </span>

            <motion.span
              className="flex size-11 shrink-0 items-center justify-center text-white"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              variants={{ hover: { opacity: 0 }, rest: { opacity: 1 } }}
            >
              <ArrowRight className="size-6" />
            </motion.span>
          </motion.span>

          {hasProgramMarquee ? (
            <motion.span
              aria-hidden
              className="-mx-6 w-[calc(100%+3rem)] overflow-hidden text-sm leading-relaxed text-white/90 sm:-mx-8 sm:w-[calc(100%+4rem)] sm:text-base"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              variants={{
                hover: { height: 'auto', marginTop: 8, opacity: 1 },
                rest: { height: 0, marginTop: 0, opacity: 0 },
              }}
            >
              <motion.span
                className="flex w-max items-center gap-3 whitespace-nowrap"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        duration: Math.max(10, programTitles.join('').length * 0.15),
                        ease: 'linear',
                        repeat: Infinity,
                      }
                }
                variants={{ hover: { x: '-50%' }, rest: { x: 0 } }}
              >
                {marqueeItems.map((programTitle, index) => (
                  <span className="flex items-center gap-3" key={`${programTitle}-${index}`}>
                    <span>{programTitle}</span>
                    <span aria-hidden>•</span>
                  </span>
                ))}
              </motion.span>
            </motion.span>
          ) : description ? (
            <motion.span
              className="overflow-hidden text-sm leading-relaxed text-white/90 sm:text-base"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              variants={{
                hover: { height: 'auto', marginTop: 8, opacity: 1 },
                rest: { height: 0, marginTop: 0, opacity: 0 },
              }}
            >
              <span className="line-clamp-3 block max-w-sm sm:line-clamp-4">{description}</span>
            </motion.span>
          ) : null}
        </div>
      </Link>
    </motion.div>
  )
}
