import type { News } from '@/payload-types'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/shared/ui/primitives/badge'
import { MediaFrame } from '@/shared/components/MediaFrame'
import { MotionReveal } from '@/shared/components/MotionReveal'
import { cn } from '@/shared/lib/cn'
import { getDocumentHref } from '@/shared/lib/getDocumentHref'
import { isMediaDocument } from '@/shared/lib/isMediaDocument'

import { formatRussianDate } from '../lib/formatRussianDate'

const noCoverNewsThemes = [
  {
    bottomDecoration:
      '-bottom-16 -left-12 size-48 rounded-[2rem] border-[1.25rem] border-white/15 -rotate-12 group-hover:translate-x-3 group-hover:-translate-y-3',
    topDecoration:
      '-top-14 -right-14 size-48 rounded-full bg-white/10 group-hover:scale-110',
  },
  {
    bottomDecoration:
      '-bottom-20 -left-20 size-52 rounded-full bg-white/10 group-hover:translate-x-3 group-hover:-translate-y-3',
    topDecoration:
      '-top-12 -right-10 size-48 rotate-45 border-[1.25rem] border-white/15 group-hover:scale-110',
  },
  {
    bottomDecoration:
      '-bottom-20 -left-16 size-44 rounded-full bg-white/10 group-hover:translate-x-3 group-hover:-translate-y-3',
    topDecoration:
      '-top-16 -right-12 size-52 rounded-full border-[1.5rem] border-white/15 group-hover:scale-110',
  },
] as const

export function NewsCard({
  news,
  priority,
  index = 0,
}: {
  news: News
  priority?: boolean
  index?: number
}) {
  const href = getDocumentHref('news', news.slug)
  const coverImage = isMediaDocument(news.coverImage) ? news.coverImage : null
  const excerpt = news.excerpt?.trim()
  const noCoverTheme = noCoverNewsThemes[index % noCoverNewsThemes.length]

  return (
    <MotionReveal className="h-full" delay={index * 0.08} duration={0.47} y={18}>
      <Link
        aria-label={news.title}
        className="group block h-full transition-transform duration-300 ease-out hover:-translate-y-2"
        href={href}
      >
        <div
          className={cn(
            'relative flex h-full min-h-[21rem] flex-col overflow-hidden rounded-base border shadow-shadow',
            coverImage
              ? 'border-border bg-card p-5 pt-0 text-foreground sm:p-6 sm:pt-0'
              : 'border-main bg-[linear-gradient(145deg,#06336f_0%,#2266B8_100%)] p-5 text-main-foreground sm:p-6',
          )}
        >
          {!coverImage ? (
            <>
              <div
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute transition-transform duration-500 ease-out',
                  noCoverTheme.topDecoration,
                )}
              />
              <div
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute transition-transform duration-500 ease-out',
                  noCoverTheme.bottomDecoration,
                )}
              />
            </>
          ) : null}

          {coverImage ? (
            <div className="relative -mx-5 sm:-mx-6">
              <MediaFrame
                alt={news.title}
                aspectClassName="aspect-[2/1]"
                className="rounded-none border-b border-border bg-secondary-background shadow-none"
                imageClassName="transition-transform duration-500 ease-out group-hover:scale-105"
                priority={priority}
                resource={coverImage}
                size="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
              >
                <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent" />
              </MediaFrame>
              <Badge className="absolute top-3 right-3 sm:top-4 sm:right-4" variant="solid">
                {formatRussianDate(news.publishedAt)}
              </Badge>
            </div>
          ) : (
            <div className="absolute top-3 right-3 flex items-start justify-end text-xs sm:top-4 sm:right-4">
              <span className="shrink-0 text-right text-white/80">
                {formatRussianDate(news.publishedAt)}
              </span>
            </div>
          )}

          <div className={cn('relative pr-10', coverImage ? 'mt-4' : 'my-auto')}>
            <h3 className={cn('font-heading leading-[1.1]', coverImage ? 'text-xl' : 'text-2xl')}>
              {news.title}
            </h3>
            {excerpt ? (
              <p
                className={cn(
                  'mt-3 line-clamp-3 text-sm leading-relaxed',
                  coverImage ? 'text-foreground/70' : 'text-white/80',
                )}
              >
                {excerpt}
              </p>
            ) : null}
          </div>

          <span
            className={cn(
              'absolute right-5 bottom-5 inline-flex',
              coverImage ? 'text-foreground' : 'text-white',
            )}
            aria-hidden="true"
          >
            <ArrowRight className="size-5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </MotionReveal>
  )
}
