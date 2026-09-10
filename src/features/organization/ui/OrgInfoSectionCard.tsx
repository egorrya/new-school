import type { OrgInfoSection } from '@/payload-types'
import type { ReactNode } from 'react'

import Link from 'next/link'

import { CollectionCardShell } from '@/shared/components/CollectionCardShell'
import { MotionReveal } from '@/shared/components/MotionReveal'
import { Badge } from '@/shared/ui/primitives/badge'
import { getDocumentHref } from '@/shared/lib/getDocumentHref'

function RevealLinkCard({
  ariaLabel,
  children,
  href,
  index = 0,
}: {
  ariaLabel: string
  children: ReactNode
  href: string
  index?: number
}) {
  return (
    <MotionReveal delay={index * 0.06} duration={0.4} y={16}>
      <Link
        aria-label={ariaLabel}
        className="block h-full transition-transform duration-300 ease-out hover:-translate-y-2"
        href={href}
      >
        {children}
      </Link>
    </MotionReveal>
  )
}

function pluralizeDocuments(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) return 'документ'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'документа'
  return 'документов'
}

export function OrgInfoSectionCard({
  section,
  index = 0,
}: {
  section: OrgInfoSection
  index?: number
}) {
  const href = getDocumentHref('org-info-sections', section.slug)
  const documentsCount = section.documents?.length ?? 0

  return (
    <RevealLinkCard ariaLabel={section.title} href={href} index={index}>
      <CollectionCardShell>
        <div className="space-y-2">
          <h3 className="font-heading text-2xl leading-[1.1]">{section.title}</h3>
          <p className="text-sm leading-relaxed text-foreground/80">
            {section.excerpt || 'Описание раздела пока не добавлено.'}
          </p>
        </div>

        {documentsCount > 0 ? (
          <div className="mt-auto pt-2">
            <Badge variant="neutral">
              {documentsCount} {pluralizeDocuments(documentsCount)}
            </Badge>
          </div>
        ) : null}
      </CollectionCardShell>
    </RevealLinkCard>
  )
}
