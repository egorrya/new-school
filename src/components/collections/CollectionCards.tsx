import type {
  GalleryAlbum,
  Job,
  Media as MediaDocument,
  News,
  OrgInfoSection,
  Review,
} from '@/payload-types'
import type { ReactNode } from 'react'

import type { VariantProps } from 'class-variance-authority'

import { ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, type cardVariants } from '@/components/ui/card'
import { MediaFrame } from '@/components/shared/MediaFrame'
import { MotionReveal } from '@/components/shared/MotionReveal'
import { getDocumentHref } from '@/utilities/getDocumentHref'
import { cn } from '@/utilities/ui'

import { getTestimonialQuoteClass } from '@/components/blocks/testimonials'

export function isMediaDocument(
  resource: number | MediaDocument | null | undefined,
): resource is MediaDocument {
  return typeof resource === 'object' && resource !== null
}

export function formatRussianDate(value?: string | null) {
  if (!value) return 'Дата не указана'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Дата не указана'

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function CollectionCardShell({
  children,
  className,
  variant = 'translucent',
}: {
  children: ReactNode
  className?: string
  variant?: VariantProps<typeof cardVariants>['variant']
}) {
  return (
    <Card className={cn('h-full overflow-hidden', className)} variant={variant}>
      <CardContent className="flex h-full flex-col gap-4 p-5 sm:p-6">{children}</CardContent>
    </Card>
  )
}

function RevealLinkCard({
  ariaLabel,
  children,
  external,
  href,
  index = 0,
}: {
  ariaLabel: string
  children: ReactNode
  external?: boolean
  href: string
  index?: number
}) {
  return (
    <MotionReveal delay={index * 0.06} duration={0.4} y={16}>
      <Link
        aria-label={ariaLabel}
        className="block h-full transition-transform duration-300 ease-out hover:-translate-y-2"
        href={href}
        rel={external ? 'noopener noreferrer' : undefined}
        target={external ? '_blank' : undefined}
      >
        {children}
      </Link>
    </MotionReveal>
  )
}

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

export function ReviewCard({ review }: { review: Review }) {
  return (
    <CollectionCardShell variant="default">
      <p className="font-heading text-5xl leading-none text-main-foreground">“</p>
      <blockquote className={cn('text-foreground', getTestimonialQuoteClass(review.text))}>
        {review.text}
      </blockquote>
      <div className="mt-auto border-t border-border pt-4">
        <p className="max-w-full whitespace-nowrap overflow-hidden text-clip font-heading text-xl leading-[1.1]">
          {review.authorName}
        </p>
        <p className="text-sm leading-relaxed text-foreground/70">
          {review.authorDescription || 'Автор отзыва'}
        </p>
      </div>
    </CollectionCardShell>
  )
}

export function JobCard({ job, index = 0 }: { job: Job; index?: number }) {
  const isExternal = Boolean(job.externalUrl)
  const href = isExternal ? job.externalUrl! : `/vacancies/${job.id}`

  return (
    <MotionReveal className="h-full" delay={index * 0.08} duration={0.47} y={18}>
      <CollectionCardShell className="transition-transform duration-300 ease-out sm:hover:-translate-y-1">
        <Link
          aria-label={job.title}
          className="group block"
          href={href}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          target={isExternal ? '_blank' : undefined}
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-heading text-2xl leading-[1.1] transition-colors sm:group-hover:text-main">
              {job.title}
            </h3>
            {isExternal ? (
              <ExternalLink aria-hidden="true" className="mt-1 size-5 shrink-0 text-foreground/50" />
            ) : null}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">
            {job.shortDescription || 'Краткое описание вакансии пока не добавлено.'}
          </p>
        </Link>
      </CollectionCardShell>
    </MotionReveal>
  )
}

function pluralizeDocuments(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) return 'документ'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'документа'
  return 'документов'
}

export function OrgInfoSectionCard({
  section,
  index = 0,
}: {
  section: OrgInfoSection
  index?: number
}) {
  const href = getDocumentHref('org-info-sections', section.slug)
  const documentsCount = section.documents?.length ?? 0

  return (
    <RevealLinkCard ariaLabel={section.title} href={href} index={index}>
      <CollectionCardShell>
        <div className="space-y-2">
          <h3 className="font-heading text-2xl leading-[1.1]">{section.title}</h3>
          <p className="text-sm leading-relaxed text-foreground/80">
            {section.excerpt || 'Описание раздела пока не добавлено.'}
          </p>
        </div>

        {documentsCount > 0 ? (
          <div className="mt-auto pt-2">
            <Badge variant="neutral">
              {documentsCount} {pluralizeDocuments(documentsCount)}
            </Badge>
          </div>
        ) : null}
      </CollectionCardShell>
    </RevealLinkCard>
  )
}

export function GalleryAlbumCard({ album, priority }: { album: GalleryAlbum; priority?: boolean }) {
  const previewImage = album.images?.find(isMediaDocument) ?? null
  const href = `/gallery-albums/${album.id}`

  return (
    <CollectionCardShell>
      <Link aria-label={album.title} className="block" href={href}>
        <MediaFrame
          alt={album.title}
          aspectClassName="aspect-[4/3]"
          priority={priority}
          resource={previewImage}
        />
      </Link>

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <Badge variant="neutral">Альбом</Badge>
          <h3 className="font-heading text-2xl leading-[1.1]">
            <Link className="transition-colors hover:text-main" href={href}>
              {album.title}
            </Link>
          </h3>
        </div>
        <Badge variant="neutral">{album.images?.length ?? 0} фото</Badge>
      </div>

      <p className="text-sm leading-relaxed text-foreground/80">
        {album.description || 'Описание альбома пока не добавлено.'}
      </p>

      <div className="mt-auto pt-2">
        <Button asChild size="sm" variant="neutral">
          <Link href={href}>Открыть альбом</Link>
        </Button>
      </div>
    </CollectionCardShell>
  )
}
