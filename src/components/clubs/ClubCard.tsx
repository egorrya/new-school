import type { Club } from '@/payload-types'

import Link from 'next/link'

import { MediaFrame } from '@/components/shared/MediaFrame'
import { MotionReveal } from '@/components/shared/MotionReveal'
import { getDocumentHref } from '@/utilities/getDocumentHref'

type ClubCardProps = {
  club: Club
  priority?: boolean
  index?: number
  className?: string
}

export function ClubCard({ club, priority, index = 0, className }: ClubCardProps) {
  const href = getDocumentHref('clubs', club.slug)

  return (
    <MotionReveal blur={2} className={className} delay={index * 0.08} duration={0.47} y={18}>
      <Link
        aria-label={club.title}
        className="group flex h-full flex-col space-y-3 pb-4 transition-transform duration-300 ease-out hover:-translate-y-2"
        href={href}
      >
        <MediaFrame
          alt={club.title}
          aspectClassName="aspect-[16/10]"
          fallbackImageSrc="/seed-media/seed-banner-1.svg"
          imageClassName="transition-transform duration-300 ease-out group-hover:scale-105"
          priority={priority}
          resource={club.previewImage ?? club.coverImage}
        />

        <h3 className="font-heading text-2xl leading-[1.1]">{club.title}</h3>

        <p className="text-sm leading-relaxed text-foreground/80">
          {club.shortDescription || 'Краткое описание программы пока не добавлено.'}
        </p>
      </Link>
    </MotionReveal>
  )
}
