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
} from '@/shared/components/PageBlock'
import { MotionReveal } from '@/shared/components/MotionReveal'
import { ProgramCategoryCard } from '@/features/page-builder/blocks/ProgramCategoriesBlock/Card.client'
import { cn } from '@/shared/lib/cn'

export const categoryColors = ['#06336f', '#FF6824', '#00B590', '#FF1E24', '#FFCB00']

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
    sort: ['sortOrder', 'title'],
    where: {
      isActive: {
        equals: true,
      },
    },
  })

  return result.docs
}

type CategoryPrograms = {
  href?: string
  titles: string[]
}

// A category page with a single active club immediately redirects to that
// club's page, so link straight there to avoid an extra navigation hop
// (which briefly flashes the footer while the redirect resolves). The same
// query also provides program titles for the optional card marquee.
async function getProgramsByCategory(): Promise<Map<number, CategoryPrograms>> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'clubs',
    depth: 0,
    limit: 0,
    overrideAccess: false,
    pagination: false,
    sort: ['sortOrder', 'title'],
    select: {
      category: true,
      slug: true,
      title: true,
    },
    where: {
      isActive: {
        equals: true,
      },
    },
  })

  const clubsByCategory = new Map<number, Array<{ slug: string; title: string }>>()

  for (const club of result.docs) {
    const categoryId = typeof club.category === 'object' ? club.category?.id : club.category

    if (!categoryId) {
      continue
    }

    const clubs = clubsByCategory.get(categoryId) ?? []
    clubs.push({ slug: club.slug, title: club.title })
    clubsByCategory.set(categoryId, clubs)
  }

  const programsByCategory = new Map<number, CategoryPrograms>()

  for (const [categoryId, clubs] of clubsByCategory) {
    programsByCategory.set(categoryId, {
      href: clubs.length === 1 ? `/programs/${clubs[0].slug}` : undefined,
      titles: clubs.map((club) => club.title),
    })
  }

  return programsByCategory
}

export async function ProgramCategoriesBlock({
  description,
  hasMobileTopGap = false,
  hideTitle,
  title,
}: ProgramCategoriesBlockProps) {
  const [categories, programsByCategory] = await Promise.all([
    getProgramCategories(),
    getProgramsByCategory(),
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
        <div className="space-y-12">
          {showHeader ? (
            <PageBlockHeader
              className="mx-auto max-w-4xl space-y-5 text-center"
              description={description}
              descriptionClassName="mx-auto max-w-2xl text-center"
              title={title}
              titleClassName="mx-auto text-2xl sm:text-3xl lg:text-4xl"
            />
          ) : null}

          {categories.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
              {categories.map((category, index) => {
                const color = categoryColors[index % categoryColors.length]
                const programs = programsByCategory.get(category.id)
                const isFourCategories = categories.length === 4
                const isCenteredLastPair =
                  categories.length % 3 === 2 && index === categories.length - 2

                return (
                  <MotionReveal
                    amount={0.15}

                    className={cn(
                      isFourCategories ? 'lg:col-span-3' : 'lg:col-span-2',
                      isCenteredLastPair && 'lg:col-start-2',
                    )}
                    delay={0.25 + index * 0.14}
                    duration={0.65}
                    key={category.id}
                    margin="-10% 0px -10% 0px"
                    y={22}
                  >
                    <ProgramCategoryCard
                      color={color}
                      description={category.description}
                      href={programs?.href ?? `/programs/category/${category.slug}`}
                      previewImage={category.previewImage}
                      programTitles={programs?.titles}
                      showProgramMarquee={category.showProgramMarquee}
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
