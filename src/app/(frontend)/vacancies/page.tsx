import type { Metadata } from 'next'

import configPromise from '@payload-config'
import type { Job } from '@/payload-types'
import { cache } from 'react'
import { getPayload } from 'payload'

import { JobCard } from '@/components/collections/CollectionCards'
import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
} from '@/components/shared/PageBlock'
import { generateMeta } from '@/lib/generateMeta'

export const dynamic = 'force-dynamic'

const queryJobs = cache(async () => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'jobs',
    depth: 0,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: '-createdAt',
    where: {
      isActive: {
        equals: true,
      },
    },
  })

  return result.docs as Job[]
})

export default async function VacanciesPage() {
  const jobs = await queryJobs()

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <div className="space-y-8">
          <PageBlockHeader
            className="mx-auto max-w-4xl text-center"
            description="Актуальные вакансии в нашей образовательной организации."
            descriptionClassName="mx-auto max-w-3xl text-center"
            headingLevel={1}
            title="Вакансии"
            titleClassName="mx-auto text-2xl sm:text-3xl lg:text-4xl"
          />

          {jobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {jobs.map((job, index) => (
                <JobCard index={index} job={job} key={job.id} />
              ))}
            </div>
          ) : (
            <PageBlockEmptyState
              description="Добавьте активные вакансии в панели управления, чтобы их увидели посетители."
              title="Вакансии пока не добавлены"
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
      slug: 'vacancies',
      title: 'Вакансии',
    },
  })
}
