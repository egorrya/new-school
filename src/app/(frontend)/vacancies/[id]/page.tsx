import type { Metadata } from 'next'

import configPromise from '@payload-config'
import type { Job } from '@/payload-types'
import Link from 'next/link'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { Button } from '@/components/ui/button'
import RichText from '@/components/shared/RichText'
import { MotionReveal } from '@/components/shared/MotionReveal'
import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockSection,
} from '@/components/shared/PageBlock'
import { generateMeta } from '@/lib/generateMeta'

export const dynamic = 'force-dynamic'

type RouteParams = {
  id: string
}

type Args = {
  params?: Promise<RouteParams>
}

const queryJobById = cache(async (id: number) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'jobs',
    depth: 0,
    limit: 1,
    pagination: false,
    overrideAccess: false,
    where: {
      id: {
        equals: id,
      },
    },
  })

  return (result.docs?.[0] as Job | undefined) || null
})

export default async function JobDetailPage({ params: paramsPromise }: Args) {
  const params = paramsPromise ? await paramsPromise : null
  const jobId = Number.parseInt(params?.id || '', 10)

  if (Number.isNaN(jobId)) {
    notFound()
  }

  const job = await queryJobById(jobId)

  if (!job) {
    notFound()
  }

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <article className="mx-auto max-w-3xl space-y-8">
          <MotionReveal blur={2} duration={0.47} y={18}>
            <h1 className="font-heading text-3xl leading-[1.1] sm:text-4xl">{job.title}</h1>
          </MotionReveal>

          <MotionReveal blur={2} delay={0.08} duration={0.47} y={18}>
            <div className="space-y-3">
              {job.description ? (
                <RichText data={job.description} enableGutter={false} enableProse={true} />
              ) : (
                <PageBlockEmptyState
                  description="Добавьте текст вакансии в панели управления, чтобы эта страница стала содержательнее."
                  title="Текст вакансии пока не добавлен"
                />
              )}
            </div>
          </MotionReveal>

          {job.contactText ? (
            <MotionReveal blur={2} delay={0.16} duration={0.47} y={18}>
              <div className="rounded-base border-2 border-border bg-secondary-background/60 p-4 text-foreground shadow-shadow sm:p-6">
                <p className="font-heading text-lg leading-tight">Как откликнуться</p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/80">
                  {job.contactText}
                </p>
              </div>
            </MotionReveal>
          ) : null}

          <MotionReveal blur={2} delay={0.24} duration={0.47} y={18}>
            <Button asChild variant="neutral">
              <Link href="/vacancies">Ко всем вакансиям</Link>
            </Button>
          </MotionReveal>
        </article>
      </PageBlockContainer>
    </PageBlockSection>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const params = paramsPromise ? await paramsPromise : null
  const jobId = Number.parseInt(params?.id || '', 10)

  if (Number.isNaN(jobId)) {
    return generateMeta({ doc: null })
  }

  const job = await queryJobById(jobId)

  if (!job) {
    return generateMeta({ doc: null })
  }

  return generateMeta({
    doc: {
      meta: {
        description: job.shortDescription,
      },
      slug: `vacancies/${job.id}`,
      title: job.title,
    },
  })
}
