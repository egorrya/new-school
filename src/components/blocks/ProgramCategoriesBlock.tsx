import type {
  ProgramCategoriesBlock as ProgramCategoriesBlockType,
  ProgramCategory,
} from '@/payload-types'

import { getPayload } from 'payload'

import configPromise from '@payload-config'

import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
} from '@/components/shared/PageBlock'
import { MotionReveal } from '@/components/shared/MotionReveal'
import { ProgramCategoryCard } from '@/components/blocks/ProgramCategoryCard.client'
import { cn } from '@/utilities/ui'

const categoryColors = ['#06336f', '#FF6824', '#00B590', '#FF1E24', '#FFCB00']

type ProgramCategoriesBlockProps = ProgramCategoriesBlockType & {
  hasMobileTopGap?: boolean
}

async function getProgramCategories(): Promise<ProgramCategory[]> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'programCategories',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: 'title',
  })

  return result.docs
}

// A category page with a single active club immediately redirects to that
// club's page, so link straight there to avoid an extra navigation hop
// (which briefly flashes the footer while the redirect resolves).
async function getSingleClubHrefByCategory(): Promise<Map<number, string>> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'clubs',
    depth: 0,
    limit: 0,
    overrideAccess: false,
    pagination: false,
    select: {
      category: true,
      slug: true,
    },
    where: {
      isActive: {
        equals: true,
      },
    },
  })

  const slugsByCategory = new Map<number, string[]>()

  for (const club of result.docs) {
    const categoryId = typeof club.category === 'object' ? club.category?.id : club.category

    if (!categoryId) {
      continue
    }

    const slugs = slugsByCategory.get(categoryId) ?? []
    slugs.push(club.slug)
    slugsByCategory.set(categoryId, slugs)
  }

  const hrefByCategory = new Map<number, string>()

  for (const [categoryId, slugs] of slugsByCategory) {
    if (slugs.length === 1) {
      hrefByCategory.set(categoryId, `/programs/${slugs[0]}`)
    }
  }

  return hrefByCategory
}

export async function ProgramCategoriesBlock({
  description,
  hasMobileTopGap = false,
  hideTitle,
  title,
}: ProgramCategoriesBlockProps) {
  const [categories, singleClubHrefByCategory] = await Promise.all([
    getProgramCategories(),
    getSingleClubHrefByCategory(),
  ])
  const showHeader = !hideTitle && Boolean(title)

  return (
    <PageBlockSection
      className={cn(
        showHeader ? 'py-5 sm:py-7 lg:py-9' : 'pt-0 pb-5 sm:pb-7 lg:pb-9',
        hasMobileTopGap && 'pt-4 sm:pt-0',
      )}
      spacing="none"
    >
      <PageBlockContainer>
        <div className={cn(showHeader ? 'space-y-3' : 'space-y-8')}>
          {showHeader ? (
            <PageBlockHeader
              className="mx-auto max-w-4xl text-center"
              description={description}
              descriptionClassName="mx-auto max-w-2xl text-center"
              title={title}
              titleClassName="mx-auto text-2xl sm:text-3xl lg:text-4xl"
            />
          ) : null}

          {categories.length > 0 ? (
            <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
              {categories.map((category, index) => {
                const color = categoryColors[index % categoryColors.length]
                const isCenteredLastPair =
                  categories.length % 3 === 2 && index === categories.length - 2

                return (
                  <MotionReveal
                    amount={0.15}

                    className={cn('lg:col-span-2', isCenteredLastPair && 'lg:col-start-2')}
                    delay={index * 0.08}
                    duration={0.47}
                    key={category.id}
                    margin="0px 0px -10% 0px"
                    once
                    y={18}
                  >
                    <ProgramCategoryCard
                      color={color}
                      description={category.description}
                      href={
                        singleClubHrefByCategory.get(category.id) ??
                        `/programs/category/${category.slug}`
                      }
                      previewImage={category.previewImage}
                      title={category.title}
                    />
                  </MotionReveal>
                )
              })}
            </div>
          ) : (
            <PageBlockEmptyState
              description="Добавьте хотя бы одну категорию программ в Payload, чтобы она появилась здесь."
              title="Категории программ пока не найдены"
            />
          )}
        </div>
      </PageBlockContainer>
    </PageBlockSection>
  )
}
