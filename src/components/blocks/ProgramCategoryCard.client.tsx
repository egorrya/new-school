'use client'

import type { Media as MediaType } from '@/payload-types'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'

import { Media } from '@/components/shared/Media'
import { cn } from '@/utilities/ui'

type ProgramCategoryCardProps = {
  title: string
  description?: null | string
  href: string
  color: string
  previewImage?: MediaType | number | null
}

export function ProgramCategoryCard({
  color,
  description,
  href,
  previewImage,
  title,
}: ProgramCategoryCardProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const mediaResource = typeof previewImage === 'object' ? previewImage : null

  return (
    <motion.div
      animate="rest"
      className="h-full"
      initial="rest"
      transition={{ duration: 0.3, ease: 'easeOut' }}
      variants={{ hover: { y: -6 }, rest: { y: 0 } }}
      whileHover={shouldReduceMotion ? undefined : 'hover'}
    >
      <Link
        aria-label={title}
        className="group relative flex h-full min-h-[13rem] flex-col justify-end overflow-hidden rounded-base p-6 text-white shadow-shadow sm:p-8"
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
            resource={mediaResource}
          />
        ) : null}

        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-black/85 via-black/45 to-black/10"
        />

        <div className="relative z-10 grid">
          <motion.span
            className="col-start-1 row-start-1 flex items-end justify-between gap-4"
            transition={{ duration: 0.3, ease: 'easeOut' }}
            variants={{
              hover: { opacity: 0, y: -8 },
              rest: { opacity: 1, y: 0 },
            }}
          >
            <span
              className={cn('font-heading text-xl leading-[1.15] font-medium sm:text-2xl')}
            >
              {title}
            </span>

            <motion.span
              className="flex size-11 shrink-0 items-center justify-center text-white"
              transition={{ duration: 0.3, ease: 'easeOut' }}
              variants={{ hover: { x: 16 }, rest: { x: 0 } }}
            >
              <ArrowRight className="size-6" />
            </motion.span>
          </motion.span>

          {description ? (
            <motion.span
              className="col-start-1 row-start-1 line-clamp-3 max-w-sm text-sm leading-relaxed text-white/90 sm:text-base"
              transition={{ duration: 0.3, ease: 'easeOut' }}
              variants={{
                hover: { opacity: 1, y: 0 },
                rest: { opacity: 0, y: 8 },
              }}
            >
              {description}
            </motion.span>
          ) : null}
        </div>
      </Link>
    </motion.div>
  )
}
