import type { Metadata } from 'next'

import configPromise from '@payload-config'
import type { Job } from '@/payload-types'
import { cache } from 'react'
import { getPayload } from 'payload'

import { JobCard } from '@/features/vacancies/ui/JobCard'
import { TeacherSpotlightBlock } from '@/features/page-builder/blocks/TeacherSpotlightBlock/View'
import { VacancyApplicationSection } from '@/features/vacancies/ui/VacancyApplicationSection'
import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockSection,
} from '@/shared/components/PageBlock'
import { generateMeta } from '@/server/seo/generateMeta'


type SearchParams = {
  job?: string | string[]
}

type Args = {
  searchParams?: Promise<SearchParams>
}

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

export default async function VacanciesPage({ searchParams: searchParamsPromise }: Args) {
  const jobs = await queryJobs()
  const searchParams = searchParamsPromise ? await searchParamsPromise : {}
  const jobParam = Array.isArray(searchParams.job) ? searchParams.job[0] : searchParams.job
  const selectedJobId = typeof jobParam === 'string' ? Number(jobParam) : NaN
  const selectedJob = Number.isInteger(selectedJobId)
    ? jobs.find((job) => job.id === selectedJobId) || null
    : null

  return (
    <>
      <TeacherSpotlightBlock
        blockType="teacherSpotlight"
        imagePosition="right"
        text="Ищем увлечённых педагогов, которые любят своё дело и верят, что учиться можно с интересом."
        title="Присоединяйтесь к команде «Новой школы»"
      />
      <PageBlockSection>
        <PageBlockContainer>
          <div className="space-y-8">
            {jobs.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {jobs.map((job, index) => (
                  <JobCard index={index} job={job} key={job.id} />
                ))}
              </div>
            ) : (
              <PageBlockEmptyState
                className="mx-auto w-fit max-w-full"
                description={null}
                title="В данный момент вакансий нет"
              />
            )}

            <VacancyApplicationSection jobs={jobs} selectedJob={selectedJob} />
          </div>
        </PageBlockContainer>
      </PageBlockSection>
    </>
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
