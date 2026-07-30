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

import { ExternalLink } from 'lucide-react'
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

  return (
    <MotionReveal delay={index * 0.08} duration={0.47} y={18}>
      <Link
        aria-label={news.title}
        className="group flex h-full flex-col space-y-3 transition-transform duration-300 ease-out hover:-translate-y-2"
        href={href}
      >
        <MediaFrame
          alt={news.title}
          aspectClassName="aspect-[16/10]"
          fallbackImageSrc="/seed-media/seed-banner-1.svg"
          priority={priority}
          resource={news.coverImage}
        >
          <Badge className="absolute right-3 bottom-3" variant="solid">
            {formatRussianDate(news.publishedAt)}
          </Badge>
        </MediaFrame>

        <h3 className="font-heading text-2xl leading-[1.1] transition-colors group-hover:text-main">
          {news.title}
        </h3>

        <p className="text-sm leading-relaxed text-foreground/80">
          {news.excerpt || 'Анонс новости пока не добавлен.'}
        </p>
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
    <RevealLinkCard ariaLabel={job.title} external={isExternal} href={href} index={index}>
      <CollectionCardShell>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-2xl leading-[1.1]">{job.title}</h3>
          {isExternal ? (
            <ExternalLink aria-hidden="true" className="mt-1 size-5 shrink-0 text-foreground/50" />
          ) : null}
        </div>
        <p className="text-sm leading-relaxed text-foreground/80">
          {job.shortDescription || 'Краткое описание вакансии пока не добавлено.'}
        </p>
      </CollectionCardShell>
    </RevealLinkCard>
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
