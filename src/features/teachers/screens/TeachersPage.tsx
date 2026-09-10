import type { Metadata } from 'next'

import configPromise from '@payload-config'
import type { Media, Teacher } from '@/payload-types'
import { cache, Fragment } from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { TeacherListGrid } from '@/features/page-builder/blocks/TeacherListBlock/Grid.client'
import { TeacherSpotlightBlock } from '@/features/page-builder/blocks/TeacherSpotlightBlock/View'
import { TEACHERS_INTRO_IMAGE_ALT } from '@/features/teachers/constants'
import { SiteContactsSection } from '@/shared/layout/SiteContactsSection'
import { MotionReveal } from '@/shared/components/MotionReveal'
import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockSection,
} from '@/shared/components/PageBlock'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/primitives/pagination'
import { generateMeta } from '@/server/seo/generateMeta'

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

const queryTeachersIntroImage = cache(async () => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: false,
    where: {
      alt: {
        equals: TEACHERS_INTRO_IMAGE_ALT,
      },
    },
  })

  return (result.docs[0] as Media | undefined) ?? null
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

  const [result, introImage] = await Promise.all([queryTeachers(page), queryTeachersIntroImage()])

  if (page > 1 && page > result.totalPages) {
    notFound()
  }

  const teachers = result.docs as Teacher[]
  const pageNumbers = getPageNumbers(result.page ?? 1, result.totalPages)

  return (
    <>
      <TeacherSpotlightBlock
        blockType="teacherSpotlight"
        headingLevel={1}
        image={introImage}
        imagePosition="right"
        text="Опытные педагоги, которые помогают детям учиться с интересом и уверенностью."
        title="Преподаватели"
      />
      <PageBlockSection>
        <PageBlockContainer>
          <div className="space-y-8">
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
                            className={
                              !result.hasPrevPage ? 'pointer-events-none opacity-0' : undefined
                            }
                            href={`/teachers?page=${Math.max(1, page - 1)}`}
                          />
                        </MotionReveal>
                      </PaginationItem>

                      {pageNumbers.map((pageNumber, index) => {
                        const previous = pageNumbers[index - 1]
                        const showEllipsisBefore =
                          previous !== undefined && pageNumber - previous > 1

                        return (
                          <Fragment key={pageNumber}>
                            {showEllipsisBefore ? (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            ) : null}
                            <PaginationItem>
                              <MotionReveal
                                amount={0.15}
                                delay={(index + 1) * 0.06}
                                duration={0.27}
                                y={10}
                              >
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
                            className={
                              !result.hasNextPage ? 'pointer-events-none opacity-0' : undefined
                            }
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
      <SiteContactsSection />
    </>
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
