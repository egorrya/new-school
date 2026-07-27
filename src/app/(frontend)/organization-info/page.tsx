import type { Metadata } from 'next'

import configPromise from '@payload-config'
import type { OrgInfoSection } from '@/payload-types'
import { cache } from 'react'
import { getPayload } from 'payload'

import { OrgInfoSectionCard } from '@/components/collections/CollectionCards'
import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
} from '@/components/shared/PageBlock'
import { generateMeta } from '@/lib/generateMeta'

export const dynamic = 'force-dynamic'

const queryOrgInfoSections = cache(async () => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'org-info-sections',
    depth: 0,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: 'sortOrder',
  })

  return result.docs as OrgInfoSection[]
})

export default async function OrgInfoPage() {
  const sections = await queryOrgInfoSections()

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <div className="space-y-8">
          <PageBlockHeader
            className="mx-auto max-w-4xl text-center"
            description="Информация публикуется в соответствии с требованиями законодательства Российской Федерации об образовании."
            descriptionClassName="mx-auto max-w-3xl text-center"
            headingLevel={1}
            title="Сведения об образовательной организации"
            titleClassName="mx-auto text-2xl sm:text-3xl lg:text-4xl"
          />

          {sections.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {sections.map((section, index) => (
                <OrgInfoSectionCard index={index} key={section.id} section={section} />
              ))}
            </div>
          ) : (
            <PageBlockEmptyState
              description="Добавьте разделы сведений об образовательной организации в панели управления."
              title="Разделы пока не добавлены"
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
      slug: 'organization-info',
      title: 'Сведения об образовательной организации',
    },
  })
}
