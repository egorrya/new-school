import type { Metadata } from 'next'

import configPromise from '@payload-config'
import type { News } from '@/payload-types'
import { cache } from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'

import { NewsCard } from '@/components/collections/CollectionCards'
import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
  PageBlockSurface,
} from '@/components/shared/PageBlock'
import { Button } from '@/components/ui/button'
import { generateMeta } from '@/lib/generateMeta'

export const dynamic = 'force-dynamic'

const queryNews = cache(async () => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'news',
    depth: 1,
    limit: 100,
    pagination: false,
    overrideAccess: false,
    sort: '-publishedAt',
    where: {
      publishedAt: {
        less_than_equal: new Date().toISOString(),
      },
    },
  })

  return result.docs as News[]
})

export default async function NewsPage() {
  const news = await queryNews()

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <PageBlockSurface className="bg-card p-6 sm:p-8 lg:p-10">
          <div className="space-y-8">
            <PageBlockHeader
              description="Свежие новости школы, анонсы и важные обновления."
              headingLevel={1}
              title="Новости школы"
              titleClassName="text-3xl sm:text-4xl lg:text-5xl"
            />

            {news.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {news.map((item, index) => (
                  <NewsCard
                    key={item.id || `${item.title}-${index}`}
                    news={item}
                    priority={index === 0}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <PageBlockEmptyState
                  description="Добавьте опубликованные новости в Payload, чтобы они появились в этом разделе."
                  title="Новостей пока нет"
                />
                <Button asChild>
                  <Link href="/">На главную</Link>
                </Button>
              </div>
            )}
          </div>
        </PageBlockSurface>
      </PageBlockContainer>
    </PageBlockSection>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    doc: {
      slug: 'news',
      title: 'Новости',
    },
  })
}
