import type { Job } from '@/payload-types'

import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

import { CollectionCardShell } from '@/shared/components/CollectionCardShell'
import { MotionReveal } from '@/shared/components/MotionReveal'

export function JobCard({ job, index = 0 }: { job: Job; index?: number }) {
  const isExternal = Boolean(job.externalUrl)
  const href = isExternal ? job.externalUrl! : `/vacancies/${job.id}`

  return (
    <MotionReveal className="h-full" delay={index * 0.08} duration={0.47} y={18}>
      <CollectionCardShell className="transition-transform duration-300 ease-out sm:hover:-translate-y-1">
        <Link
          aria-label={job.title}
          className="group block"
          href={href}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          target={isExternal ? '_blank' : undefined}
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-heading text-2xl leading-[1.1] transition-colors sm:group-hover:text-main">
              {job.title}
            </h3>
            {isExternal ? (
              <ExternalLink aria-hidden="true" className="mt-1 size-5 shrink-0 text-foreground/50" />
            ) : null}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">
            {job.shortDescription || 'Краткое описание вакансии пока не добавлено.'}
          </p>
        </Link>
      </CollectionCardShell>
    </MotionReveal>
  )
}
