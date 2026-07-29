import type { Metadata } from 'next'

import type { Club } from '@/payload-types'

import { cache } from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import configPromise from '@payload-config'

import Link from 'next/link'

import { TabsBlock } from '@/components/blocks/TabsBlock'
import { ClubCoverImage } from '@/components/clubs/ClubCoverImage.client'
import { ClubInfoCards } from '@/components/clubs/ClubInfoCards'
import { MotionReveal } from '@/components/shared/MotionReveal'
import { PageBlockContainer, PageBlockHeader, PageBlockSection } from '@/components/shared/PageBlock'
import { Badge } from '@/components/ui/badge'
import { generateMeta } from '@/lib/generateMeta'
import { getDocumentHref } from '@/utilities/getDocumentHref'
import { getServerSideURL } from '@/utilities/getURL'
import { draftMode } from 'next/headers'

export const dynamic = 'force-dynamic'

type RouteParams = {
  slug: string
}

type Args = {
  params?: Promise<RouteParams>
}

const queryClubBySlug = cache(async (slug: string) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'clubs',
    depth: 2,
    draft,
    limit: 1,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
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

  return (result.docs?.[0] as Club | undefined) || null
})

const queryCategoryClubCount = cache(async (categoryId: number, draft: boolean) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'clubs',
    draft,
    limit: 0,
    overrideAccess: draft,
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

  return result.totalDocs
})

export default async function ClubPage({ params: paramsPromise }: Args) {
  const params = paramsPromise ? await paramsPromise : null
  const slug = params?.slug

  if (!slug) {
    notFound()
  }

  const club = await queryClubBySlug(slug)

  if (!club) {
    notFound()
  }

  const { isEnabled: draft } = await draftMode()
  const clubPageUrl = new URL(`/programs/${club.slug}`, getServerSideURL()).toString()
  const hasCoverImage = typeof club.coverImage === 'object' && club.coverImage !== null
  const category = typeof club.category === 'object' && club.category !== null ? club.category : null
  const categoryClubCount = category ? await queryCategoryClubCount(category.id, draft) : 0
  const showCategoryBadge = Boolean(category) && categoryClubCount > 1

  return (
    <>
      <PageBlockSection className="-mb-8 sm:-mb-12 lg:-mb-16">
        <PageBlockContainer>
          <div className="space-y-8">
            {showCategoryBadge && category ? (
              <MotionReveal amount={0.35} duration={0.4} y={10}>
                <div className="flex justify-center">
                  <Badge asChild variant="solid">
                    <Link href={getDocumentHref('programCategories', category.slug)}>
                      {category.title}
                    </Link>
                  </Badge>
                </div>
              </MotionReveal>
            ) : null}

            <PageBlockHeader
              className="mx-auto max-w-4xl text-center"
              description={club.shortDescription}
              descriptionClassName="mx-auto max-w-2xl text-center"
              headingLevel={1}
              title={club.title}
              titleClassName="mx-auto text-2xl sm:text-3xl lg:text-4xl"
            />

            <ClubInfoCards cards={club.infoCards} />

            {hasCoverImage ? (
              <MotionReveal amount={0.35} blur={2} duration={0.47} y={18}>
                <ClubCoverImage
                  alt={club.title}
                  position={club.coverImagePosition}
                  resource={club.coverImage}
                />
              </MotionReveal>
            ) : null}
          </div>
        </PageBlockContainer>
      </PageBlockSection>

      <TabsBlock
        blockType="tabs"
        clubId={club.id}
        description={null}
        pageUrl={clubPageUrl}
        tabs={club.tabs}
        title={null}
      />
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const params = paramsPromise ? await paramsPromise : null
  const slug = params?.slug

  if (!slug) {
    return generateMeta({ doc: null })
  }

  const club = await queryClubBySlug(slug)

  if (!club) {
    return generateMeta({ doc: null })
  }

  return generateMeta({
    doc: {
      meta: {
        description: club.shortDescription,
        image: club.previewImage ?? club.coverImage,
      },
      slug: club.slug,
      title: club.title,
    },
  })
}
