import type { Review, TestimonialsBlock as TestimonialsBlockType } from '@/payload-types'

import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import type { Where } from 'payload'
import { getPayload } from 'payload'

import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
} from '@/components/shared/PageBlock'

import { TestimonialsCarousel } from './TestimonialsCarousel.client'
import { toTestimonialItems } from './testimonials'

function getSelectedReviewIds(selectedReviews: TestimonialsBlockType['selectedReviews']) {
  return (selectedReviews ?? [])
    .map((review) => (typeof review === 'object' && review !== null ? review.id : review))
    .filter((id): id is number => typeof id === 'number')
}

async function getReviews({
  itemLimit,
  selectedReviews,
}: Pick<TestimonialsBlockType, 'itemLimit' | 'selectedReviews'>) {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const selectedIds = getSelectedReviewIds(selectedReviews)
  const publishedFilter: Where | undefined = draft
    ? undefined
    : {
        isPublished: {
          equals: true,
        },
      }

  if (selectedIds.length > 0) {
    const result = await payload.find({
      collection: 'reviews',
      depth: 1,
      limit: selectedIds.length,
      overrideAccess: draft,
      pagination: false,
      where: publishedFilter
        ? {
            and: [
              {
                id: {
                  in: selectedIds,
                },
              },
              publishedFilter,
            ],
          }
        : {
            id: {
              in: selectedIds,
            },
          },
    })
    const reviewsById = new Map(result.docs.map((review) => [review.id, review as Review]))

    return selectedIds
      .map((id) => reviewsById.get(id))
      .filter((review): review is Review => Boolean(review))
  }

  const result = await payload.find({
    collection: 'reviews',
    depth: 1,
    limit: itemLimit ?? 3,
    overrideAccess: draft,
    pagination: false,
    sort: 'sortOrder',
    where: publishedFilter,
  })

  return result.docs as Review[]
}

export async function TestimonialsBlock({
  description,
  itemLimit,
  selectedReviews,
  title,
}: TestimonialsBlockType) {
  const reviews = await getReviews({ itemLimit, selectedReviews })
  const testimonials = toTestimonialItems(reviews)

  return (
    <PageBlockSection className="flex min-h-[calc(100dvh-var(--site-header-height,0px)-var(--site-secondary-header-height,0px))] items-center">
      <PageBlockContainer>
        <div className="space-y-8 py-8 sm:py-12 lg:py-16">
          {title || description ? (
            <PageBlockHeader
              className="mx-auto flex max-w-4xl flex-col items-center text-center"
              description={description}
              descriptionClassName="mx-auto w-full max-w-3xl text-center"
              title={title || 'Отзывы'}
              titleClassName="w-full text-2xl sm:text-3xl lg:text-4xl"
            />
          ) : null}

          {testimonials.length > 0 ? (
            <TestimonialsCarousel testimonials={testimonials} />
          ) : (
            <PageBlockEmptyState
              description="Добавьте опубликованные отзывы в Payload или выберите конкретные отзывы в настройках блока."
              title="Отзывы пока не добавлены"
            />
          )}
        </div>
      </PageBlockContainer>
    </PageBlockSection>
  )
}
