import type { Metadata } from 'next'

import configPromise from '@payload-config'
import type { Teacher } from '@/payload-types'
import { cache, Fragment } from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { TeacherListGrid } from '@/components/blocks/TeacherListBlock.client'
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
import { generateMeta } from '@/lib/generateMeta'

export const dynamic = 'force-dynamic'

const TEACHERS_PER_PAGE = 12

const queryTeachers = cache(async (page: number) => {
  const payload = await getPayload({ config: configPromise })

  return payload.find({
    collection: 'teachers',
    depth: 1,
    limit: TEACHERS_PER_PAGE,
    page,
    overrideAccess: false,
    sort: 'sortOrder',
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

export default async function TeachersPage({ searchParams }: Args) {
  const resolvedSearchParams = await searchParams
  const requestedPage = Number(resolvedSearchParams?.page ?? '1')
  const page = Number.isFinite(requestedPage) && requestedPage >= 1 ? Math.floor(requestedPage) : 1

  const result = await queryTeachers(page)

  if (page > 1 && page > result.totalPages) {
    notFound()
  }

  const teachers = result.docs as Teacher[]
  const pageNumbers = getPageNumbers(result.page ?? 1, result.totalPages)

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <div className="space-y-8">
          <PageBlockHeader
            className="mx-auto max-w-4xl text-center"
            description="Команда преподавателей нашей школы."
            descriptionClassName="mx-auto max-w-3xl text-center"
            headingLevel={1}
            title="Преподаватели"
            titleClassName="mx-auto text-2xl sm:text-3xl lg:text-4xl"
          />

          {teachers.length > 0 ? (
            <>
              <TeacherListGrid teachers={teachers} />

              {result.totalPages > 1 ? (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <MotionReveal amount={0.15} delay={0} duration={0.27} y={10}>
                        <PaginationPrevious
                          aria-disabled={!result.hasPrevPage}
                          className={!result.hasPrevPage ? 'pointer-events-none opacity-0' : undefined}
                          href={`/teachers?page=${Math.max(1, page - 1)}`}
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
                            <MotionReveal amount={0.15} delay={(index + 1) * 0.06} duration={0.27} y={10}>
                              <PaginationLink
                                href={`/teachers?page=${pageNumber}`}
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
                        amount={0.15}
                        delay={(pageNumbers.length + 1) * 0.06}
                        duration={0.27}
                        y={10}
                      >
                        <PaginationNext
                          aria-disabled={!result.hasNextPage}
                          className={!result.hasNextPage ? 'pointer-events-none opacity-0' : undefined}
                          href={`/teachers?page=${Math.min(result.totalPages, page + 1)}`}
                        />
                      </MotionReveal>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              ) : null}
            </>
          ) : (
            <PageBlockEmptyState
              className="mx-auto w-fit max-w-full"
              description="Добавьте преподавателей в разделе «Преподаватели», чтобы показать список здесь."
              title="Преподаватели пока не добавлены"
            />
          )}
        </div>
      </PageBlockContainer>
    </PageBlockSection>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    doc: {
      slug: 'teachers',
      title: 'Преподаватели',
    },
  })
}
