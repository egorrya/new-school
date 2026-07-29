import type { ProgramCategoriesBlock as ProgramCategoriesBlockType, ProgramCategory } from '@/payload-types'

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

export async function ProgramCategoriesBlock({
  description,
  hideTitle,
  title,
}: ProgramCategoriesBlockType) {
  const categories = await getProgramCategories()
  const showHeader = !hideTitle && Boolean(title)

  return (
    <PageBlockSection className={cn(!showHeader && 'py-6 sm:py-8 lg:py-10')}>
      <PageBlockContainer>
        <div className="space-y-8">
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
                    amount={0.35}
                    blur={2}
                    className={cn('lg:col-span-2', isCenteredLastPair && 'lg:col-start-2')}
                    delay={index * 0.08}
                    duration={0.47}
                    key={category.id}
                    margin="0px 0px -25% 0px"
                    y={18}
                  >
                    <ProgramCategoryCard
                      color={color}
                      description={category.description}
                      href={`/programs/category/${category.slug}`}
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
