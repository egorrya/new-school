import type { Metadata } from 'next'

import configPromise from '@payload-config'
import type { OrgInfoSection } from '@/payload-types'
import { Download, FileText } from 'lucide-react'
import Link from 'next/link'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { isMediaDocument } from '@/components/collections/CollectionCards'
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
  slug: string
}

type Args = {
  params?: Promise<RouteParams>
}

function formatFileSize(bytes?: number | null) {
  if (!bytes) return null

  const units = ['Б', 'КБ', 'МБ', 'ГБ']
  let value = bytes
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  const precision = unitIndex === 0 || value >= 10 ? 0 : 1

  return `${value.toFixed(precision)} ${units[unitIndex]}`
}

const queryOrgInfoSectionBySlug = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'org-info-sections',
    depth: 1,
    limit: 1,
    pagination: false,
    overrideAccess: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return (result.docs?.[0] as OrgInfoSection | undefined) || null
})

export default async function OrgInfoSectionPage({ params: paramsPromise }: Args) {
  const params = paramsPromise ? await paramsPromise : null
  const slug = params?.slug

  if (!slug) {
    notFound()
  }

  const section = await queryOrgInfoSectionBySlug(slug)

  if (!section) {
    notFound()
  }

  const documents = (section.documents ?? []).filter((doc) => isMediaDocument(doc.file))

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <article className="mx-auto max-w-3xl space-y-8">
          <MotionReveal duration={0.47} y={18}>
            <h1 className="font-heading text-3xl leading-[1.1] sm:text-4xl">{section.title}</h1>
          </MotionReveal>

          <MotionReveal delay={0.08} duration={0.47} y={18}>
            <div className="space-y-3">
              {section.content ? (
                <RichText data={section.content} enableGutter={false} enableProse={true} />
              ) : (
                <PageBlockEmptyState
                  description="Добавьте текст раздела в панели управления, чтобы эта страница стала содержательнее."
                  title="Текст раздела пока не добавлен"
                />
              )}
            </div>
          </MotionReveal>

          {documents.length > 0 ? (
            <MotionReveal delay={0.16} duration={0.47} y={18}>
              <div className="space-y-3">
                <h2 className="font-heading text-xl leading-[1.1]">Документы</h2>
                <ul className="space-y-2">
                  {documents.map((doc, index) => {
                    const file = isMediaDocument(doc.file) ? doc.file : null

                    if (!file?.url) return null

                    const fileSize = formatFileSize(file.filesize)

                    return (
                      <li key={doc.id || index}>
                        <a
                          className="group flex items-center gap-3 rounded-base border border-border bg-white px-4 py-3 text-sm font-medium text-foreground shadow-[0.125rem_0.125rem_0_0_var(--school-black)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                          href={file.url}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          <FileText aria-hidden="true" className="size-5 shrink-0 text-foreground/70" />
                          <span className="flex-1">{doc.title}</span>
                          {fileSize ? (
                            <span className="text-xs text-foreground/60">{fileSize}</span>
                          ) : null}
                          <Download aria-hidden="true" className="size-4 shrink-0 text-foreground/50" />
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </MotionReveal>
          ) : null}

          <MotionReveal delay={0.24} duration={0.47} y={18}>
            <Button asChild variant="neutral">
              <Link href="/organization-info">Ко всем разделам</Link>
            </Button>
          </MotionReveal>
        </article>
      </PageBlockContainer>
    </PageBlockSection>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const params = paramsPromise ? await paramsPromise : null
  const slug = params?.slug

  if (!slug) {
    return generateMeta({ doc: null })
  }

  const section = await queryOrgInfoSectionBySlug(slug)

  if (!section) {
    return generateMeta({ doc: null })
  }

  return generateMeta({
    doc: {
      meta: {
        description: section.excerpt,
      },
      slug: `organization-info/${section.slug}`,
      title: section.title,
    },
  })
}
