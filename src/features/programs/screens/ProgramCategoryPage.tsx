import type { Metadata } from 'next'

import type { Club, ProgramCategory } from '@/payload-types'

import { cache } from 'react'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'

import configPromise from '@payload-config'

import { ClubCard } from '@/features/clubs/ui/ClubCard'
import { SiteContactsSection } from '@/shared/layout/SiteContactsSection'
import { BackLink } from '@/shared/components/BackLink'
import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
} from '@/shared/components/PageBlock'
import { generateMeta } from '@/server/seo/generateMeta'
import { cn } from '@/shared/lib/cn'
import { draftMode } from 'next/headers'


type RouteParams = {
  slug: string
}

type Args = {
  params?: Promise<RouteParams>
}

const queryCategoryBySlug = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'programCategories',
    depth: 0,
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return (result.docs?.[0] as ProgramCategory | undefined) || null
})

const queryClubsByCategory = cache(async (categoryId: number, draft: boolean) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'clubs',
    depth: 1,
    draft,
    limit: 100,
    overrideAccess: draft,
    pagination: false,
    sort: ['sortOrder', 'title'],
    where: {
      and: [
        {
          category: {
            equals: categoryId,
          },
        },
        {
          isActive: {
            equals: true,
          },
        },
      ],
    },
  })

  return result.docs as Club[]
})

export default async function ProgramCategoryPage({ params: paramsPromise }: Args) {
  const params = paramsPromise ? await paramsPromise : null
  const slug = params?.slug

  if (!slug) {
    notFound()
  }

  const category = await queryCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const { isEnabled: draft } = await draftMode()
  const clubs = await queryClubsByCategory(category.id, draft)

  if (clubs.length === 1) {
    redirect(`/programs/${clubs[0].slug}`)
  }

  const isSchoolCategory = category.slug === 'shkola'
  const backLink = isSchoolCategory ? (
    <BackLink href="/school" label="Школа" />
  ) : (
    <BackLink href="/programs" label="Дополнительные программы" />
  )

  return (
    <>
      <PageBlockSection>
        <PageBlockContainer>
          <div className="space-y-8">
            <PageBlockHeader
              className="mx-auto max-w-4xl space-y-8 text-center"
              description={category.description}
              descriptionClassName="mx-auto max-w-2xl text-center"
              headingLevel={1}
              leading={backLink}
              title={category.pageTitle || category.title}
              titleClassName="mx-auto text-2xl sm:text-3xl lg:text-4xl"
            />

            {clubs.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                {clubs.map((club, index) => (
                  <ClubCard
                    className={cn(
                      'xl:col-span-2',
                      clubs.length === 2 && index === 0 && 'xl:col-start-2',
                    )}
                    club={club}
                    index={index}
                    key={club.id}
                    priority={index === 0}
                  />
                ))}
              </div>
            ) : (
              <PageBlockEmptyState
                description="Добавьте хотя бы одну активную программу в эту категорию, чтобы она появилась здесь."
                title="Программы в этой категории пока не найдены"
              />
            )}
          </div>
        </PageBlockContainer>
      </PageBlockSection>
      <SiteContactsSection />
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const params = paramsPromise ? await paramsPromise : null
  const slug = params?.slug

  if (!slug) {
    return generateMeta({ doc: null })
  }

  const category = await queryCategoryBySlug(slug)

  if (!category) {
    return generateMeta({ doc: null })
  }

  return generateMeta({
    doc: {
      meta: {
        description: category.description,
      },
      slug: category.slug,
      title: category.title,
    },
  })
}
