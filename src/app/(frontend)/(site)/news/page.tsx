import type { Metadata } from 'next'

import configPromise from '@payload-config'
import type { News } from '@/payload-types'
import { cache, Fragment } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { NewsCard } from '@/components/collections/CollectionCards'
import { MotionReveal } from '@/components/shared/MotionReveal'
import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
} from '@/components/shared/PageBlock'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { generateMeta } from '@/lib/generateMeta'

export const dynamic = 'force-dynamic'

const NEWS_PER_PAGE = 9

const queryNews = cache(async (page: number) => {
  const payload = await getPayload({ config: configPromise })

  return payload.find({
    collection: 'news',
    depth: 1,
    limit: NEWS_PER_PAGE,
    page,
    overrideAccess: false,
    sort: '-publishedAt',
    where: {
      publishedAt: {
        less_than_equal: new Date().toISOString(),
      },
    },
  })
})

function getPageNumbers(page: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1])
  return Array.from(pages)
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b)
}

type Args = {
  searchParams?: Promise<{ page?: string }>
}

export default async function NewsPage({ searchParams }: Args) {
  const resolvedSearchParams = await searchParams
  const requestedPage = Number(resolvedSearchParams?.page ?? '1')
  const page = Number.isFinite(requestedPage) && requestedPage >= 1 ? Math.floor(requestedPage) : 1

  const result = await queryNews(page)

  if (page > 1 && page > result.totalPages) {
    notFound()
  }

  const news = result.docs as News[]
  const pageNumbers = getPageNumbers(result.page ?? 1, result.totalPages)

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <div className="space-y-8">
          <PageBlockHeader
            className="mx-auto max-w-4xl text-center"
            description="Свежие новости школы, анонсы и важные обновления."
            descriptionClassName="mx-auto max-w-3xl text-center"
            headingLevel={1}
            title="Новости школы"
            titleClassName="mx-auto text-2xl sm:text-3xl lg:text-4xl"
          />

          {news.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {news.map((item, index) => (
                  <NewsCard
                    key={item.id || `${item.title}-${index}`}
                    index={index}
                    news={item}
                    priority={index === 0}
                  />
                ))}
              </div>

              {result.totalPages > 1 ? (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <MotionReveal amount={0.6} delay={0} duration={0.27} y={10}>
                        <PaginationPrevious
                          aria-disabled={!result.hasPrevPage}
                          className={!result.hasPrevPage ? 'pointer-events-none opacity-0' : undefined}
                          href={`/news?page=${Math.max(1, page - 1)}`}
                        />
                      </MotionReveal>
                    </PaginationItem>

                    {pageNumbers.map((pageNumber, index) => {
                      const previous = pageNumbers[index - 1]
                      const showEllipsisBefore = previous !== undefined && pageNumber - previous > 1

                      return (
                        <Fragment key={pageNumber}>
                          {showEllipsisBefore ? (
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : null}
                          <PaginationItem>
                            <MotionReveal amount={0.6} delay={(index + 1) * 0.06} duration={0.27} y={10}>
                              <PaginationLink
                                href={`/news?page=${pageNumber}`}
                                isActive={pageNumber === page}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </MotionReveal>
                          </PaginationItem>
                        </Fragment>
                      )
                    })}

                    <PaginationItem>
                      <MotionReveal
                        amount={0.6}
                        delay={(pageNumbers.length + 1) * 0.06}
                        duration={0.27}
                        y={10}
                      >
                        <PaginationNext
                          aria-disabled={!result.hasNextPage}
                          className={!result.hasNextPage ? 'pointer-events-none opacity-0' : undefined}
                          href={`/news?page=${Math.min(result.totalPages, page + 1)}`}
                        />
                      </MotionReveal>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              ) : null}
            </>
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
