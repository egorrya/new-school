import type { Metadata } from 'next'

import configPromise from '@payload-config'
import type { News } from '@/payload-types'
import Link from 'next/link'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { formatRussianDate } from '@/components/collections/CollectionCards'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import RichText from '@/components/shared/RichText'
import { MediaFrame } from '@/components/shared/MediaFrame'
import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockSection,
  PageBlockSurface,
} from '@/components/shared/PageBlock'
import { generateMeta } from '@/lib/generateMeta'

export const dynamic = 'force-dynamic'

type RouteParams = {
  slug: string
}

type Args = {
  params?: Promise<RouteParams>
}

const queryNewsBySlug = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'news',
    depth: 1,
    limit: 1,
    pagination: false,
    overrideAccess: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          publishedAt: {
            less_than_equal: new Date().toISOString(),
          },
        },
      ],
    },
  })

  return (result.docs?.[0] as News | undefined) || null
})

export default async function NewsDetailPage({ params: paramsPromise }: Args) {
  const params = paramsPromise ? await paramsPromise : null
  const slug = params?.slug

  if (!slug) {
    notFound()
  }

  const news = await queryNewsBySlug(slug)

  if (!news) {
    notFound()
  }

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <PageBlockSurface className="overflow-hidden bg-card">
          <article className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:p-10">
            <MediaFrame
              alt={news.title}
              aspectClassName="aspect-[4/3]"
              priority
              resource={news.coverImage}
            />

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="neutral">Новость</Badge>
                  <Badge variant="neutral">{formatRussianDate(news.publishedAt)}</Badge>
                </div>
                <h1 className="font-heading text-4xl leading-[0.95] sm:text-5xl">
                  {news.title}
                </h1>
                {news.excerpt ? (
                  <p className="max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-lg">
                    {news.excerpt}
                  </p>
                ) : null}
              </div>

              <div className="space-y-3">
                <p className="text-sm text-foreground/60">Текст новости</p>
                {news.content ? (
                  <RichText data={news.content} enableGutter={false} enableProse={true} />
                ) : (
                  <PageBlockEmptyState
                    description="Добавьте текст новости в Payload, чтобы эта страница стала содержательнее."
                    title="Текст новости пока не добавлен"
                  />
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild variant="neutral">
                  <Link href="/news">К новостям</Link>
                </Button>
                <Button asChild>
                  <Link href="/">На главную</Link>
                </Button>
              </div>
            </div>
          </article>
        </PageBlockSurface>
      </PageBlockContainer>
    </PageBlockSection>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const params = paramsPromise ? await paramsPromise : null
  const slug = params?.slug

  if (!slug) {
    return generateMeta({ doc: null })
  }

  const news = await queryNewsBySlug(slug)

  if (!news) {
    return generateMeta({ doc: null })
  }

  return generateMeta({
    doc: {
      meta: {
        description: news.excerpt,
        image: news.coverImage,
      },
      slug: `news/${news.slug}`,
      title: news.title,
    },
  })
}
