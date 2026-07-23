import type { GalleryAlbum, Job, Media as MediaDocument, News, Review, Teacher } from '@/payload-types'
import type { ReactNode } from 'react'

import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import RichText from '@/components/shared/RichText'
import { MediaFrame } from '@/components/shared/MediaFrame'
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

function CollectionCardShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={cn('h-full overflow-hidden bg-card', className)}>
      <CardContent className="flex h-full flex-col gap-4 p-5 sm:p-6">{children}</CardContent>
    </Card>
  )
}

export function NewsCard({ news, priority }: { news: News; priority?: boolean }) {
  const href = getDocumentHref('news', news.slug)

  return (
    <CollectionCardShell className="bg-secondary-background/25">
      <Link aria-label={news.title} className="block" href={href}>
        <MediaFrame
          alt={news.title}
          aspectClassName="aspect-[16/10]"
          priority={priority}
          resource={news.coverImage}
        />
      </Link>

      <div className="flex items-start justify-end gap-3">
        <Badge variant="neutral">{formatRussianDate(news.publishedAt)}</Badge>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-2xl leading-[1.1]">
          <Link className="transition-colors hover:text-main" href={href}>
            {news.title}
          </Link>
        </h3>
        <p className="text-sm leading-relaxed text-foreground/80">
          {news.excerpt || 'Анонс новости пока не добавлен.'}
        </p>
      </div>

      <div className="mt-auto pt-2">
        <Button asChild size="sm" variant="neutral">
          <Link href={href}>Читать новость</Link>
        </Button>
      </div>
    </CollectionCardShell>
  )
}

export function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <CollectionCardShell className="bg-background/70">
      <div className="grid gap-4 sm:grid-cols-[minmax(7rem,0.7fr)_minmax(0,1fr)] sm:items-start">
        <MediaFrame
          alt={teacher.name}
          aspectClassName="aspect-square"
          resource={teacher.photo}
        />

        <div className="space-y-3">
          <Badge variant="neutral">{teacher.position || 'Преподаватель'}</Badge>
          <h3 className="font-heading text-2xl leading-[1.1]">{teacher.name}</h3>
          {teacher.description ? (
            <div className="text-sm leading-relaxed text-foreground/80">
              <RichText data={teacher.description} enableGutter={false} enableProse={false} />
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-foreground/70">
              Профиль преподавателя пока не заполнен.
            </p>
          )}
        </div>
      </div>
    </CollectionCardShell>
  )
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="h-full bg-card">
      <CardContent className="flex h-full flex-col gap-4 p-5 sm:p-6">
        <p className="font-heading text-5xl leading-none text-main-foreground">“</p>
        <blockquote className={cn('text-foreground', getTestimonialQuoteClass(review.text))}>
          {review.text}
        </blockquote>
        <div className="mt-auto border-t-2 border-border pt-4">
          <p className="max-w-full whitespace-nowrap overflow-hidden text-clip font-heading text-xl leading-[1.1]">
            {review.authorName}
          </p>
          <p className="text-sm leading-relaxed text-foreground/70">
            {review.authorDescription || 'Автор отзыва'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function JobCard({ job }: { job: Job }) {
  return (
    <CollectionCardShell className="bg-secondary-background/25">
      <Badge variant="neutral">Вакансия</Badge>
      <div className="space-y-2">
        <h3 className="font-heading text-2xl leading-[1.1]">{job.title}</h3>
        <p className="text-sm leading-relaxed text-foreground/80">
          {job.shortDescription || 'Краткое описание вакансии пока не добавлено.'}
        </p>
      </div>
      {job.description ? (
        <div className="text-sm leading-relaxed text-foreground/80">
          <RichText data={job.description} enableGutter={false} enableProse={false} />
        </div>
      ) : null}
      {job.contactText ? <Badge variant="neutral">{job.contactText}</Badge> : null}
    </CollectionCardShell>
  )
}

export function GalleryAlbumCard({ album, priority }: { album: GalleryAlbum; priority?: boolean }) {
  const previewImage = album.images?.find(isMediaDocument) ?? null
  const href = `/gallery-albums/${album.id}`

  return (
    <CollectionCardShell className="bg-background/70">
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
