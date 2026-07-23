import type { Metadata } from 'next'

import type { Club } from '@/payload-types'

import Link from 'next/link'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import configPromise from '@payload-config'

import { CTAFormBlock } from '@/components/blocks/CTAFormBlock'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import RichText from '@/components/shared/RichText'
import { MediaFrame } from '@/components/shared/MediaFrame'
import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockSection,
  PageBlockSurface,
} from '@/components/shared/PageBlock'
import { generateMeta } from '@/lib/generateMeta'
import { getGlobal } from '@/utilities/getGlobals'
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
    depth: 1,
    draft,
    limit: 1,
    pagination: false,
    sort: 'sortOrder,title',
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

function DetailStat({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <Card className="bg-secondary-background/25">
      <CardContent className="space-y-2 p-4">
        <p className="text-xs text-foreground/60">{label}</p>
        <p className="font-heading text-xl leading-tight">{value}</p>
      </CardContent>
    </Card>
  )
}

export default async function ClubPage({ params: paramsPromise }: Args) {
  const params = paramsPromise ? await paramsPromise : null
  const slug = params?.slug

  if (!slug) {
    notFound()
  }

  const [club, siteSettings] = await Promise.all([
    queryClubBySlug(slug),
    getGlobal('site-settings'),
  ])

  if (!club) {
    notFound()
  }

  const applicationText = siteSettings?.defaultApplicationCtaText || 'Оставить заявку'
  const clubPageUrl = new URL(`/clubs/${club.slug}`, getServerSideURL()).toString()

  return (
    <>
      <PageBlockSection>
        <PageBlockContainer>
          <PageBlockSurface className="overflow-hidden bg-card">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:p-10">
              <MediaFrame
                alt={club.title}
                aspectClassName="aspect-[4/3]"
                priority
                resource={club.coverImage}
              />

              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-sm text-foreground/60">Кружок</p>
                  <h1 className="font-heading text-3xl leading-[1.1] sm:text-4xl">
                    {club.title}
                  </h1>
                  {club.shortDescription ? (
                    <p className="max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-lg">
                      {club.shortDescription}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <DetailStat label="Возраст" value={club.ageText || 'Возраст не указан'} />
                  <DetailStat label="Расписание" value={club.scheduleText || 'Расписание не указано'} />
                  <DetailStat label="Стоимость" value={club.priceText || 'Стоимость не указана'} />
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-foreground/60">Описание</p>
                  {club.description ? (
                    <RichText data={club.description} enableGutter={false} enableProse={true} />
                  ) : (
                    <PageBlockEmptyState
                      description="Добавьте описание кружка в Payload, чтобы эта страница стала подробнее."
                      title="Описание пока не добавлено"
                    />
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <a href="#club-application">{applicationText}</a>
                  </Button>
                  <Button asChild variant="neutral">
                    <Link href="/clubs">К списку кружков</Link>
                  </Button>
                </div>
              </div>
            </div>
          </PageBlockSurface>
        </PageBlockContainer>
      </PageBlockSection>

      <div id="club-application" className="scroll-mt-24">
        <CTAFormBlock
          buttonLabel={applicationText}
          clubId={club.id}
          description={`Оставьте заявку на кружок «${club.title}», и мы свяжемся с вами.`}
          formType="club"
          pageUrl={clubPageUrl}
          title="Заявка на кружок"
        />
      </div>
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
        image: club.coverImage,
      },
      slug: club.slug,
      title: club.title,
    },
  })
}
