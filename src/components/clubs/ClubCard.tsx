import type { Club } from '@/payload-types'

import { ArrowRight, CalendarDays } from 'lucide-react'
import Link from 'next/link'

import { MediaFrame } from '@/components/shared/MediaFrame'
import { MotionReveal } from '@/components/shared/MotionReveal'
import { getDocumentHref } from '@/utilities/getDocumentHref'
import { cn } from '@/utilities/ui'

type ClubCardProps = {
  club: Club
  priority?: boolean
  index?: number
  className?: string
}

const SCHEDULE_CARD_SLUG = 'raspisanie-kruzhkov'

const weekdayPills = [
  { color: '#E1483F', label: 'Пн' },
  { color: '#D99A00', label: 'Вт' },
  { color: '#1E9C67', label: 'Ср' },
  { color: '#2266B8', label: 'Чт' },
  { color: '#E1483F', label: 'Пт' },
  { color: '#D99A00', label: 'Сб' },
  { color: '#1E9C67', label: 'Вс' },
]

function ScheduleCardLink({
  club,
  className,
  href,
  index = 0,
}: {
  club: Club
  className?: string
  href: string
  index?: number
}) {
  return (
    <MotionReveal
      amount={0.15}
      className={cn('h-full', className)}
      delay={index * 0.08}
      duration={0.47}
      margin="-10% 0px -10% 0px"
      y={18}
    >
      <Link
        aria-label={club.title}
        className="group relative flex h-full min-h-72 flex-col overflow-hidden rounded-base bg-[linear-gradient(150deg,#06336f_0%,#0d4590_50%,#2266B8_100%)] p-6 text-white shadow-shadow transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 sm:p-7"
        href={href}
      >
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full origin-center text-white/12 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08] group-hover:text-white/22"
          style={{
            maskImage: 'radial-gradient(120% 100% at 100% 0%, black 0%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(120% 100% at 100% 0%, black 0%, transparent 75%)',
          }}
        >
          <defs>
            <pattern height="18" id="schedule-card-notebook-grid" patternUnits="userSpaceOnUse" width="18">
              <path d="M 18 0 L 0 0 0 18" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect fill="url(#schedule-card-notebook-grid)" height="100%" width="100%" />
        </svg>

        <div className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-white/15 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:bg-white/25">
          <CalendarDays className="size-7" />
        </div>

        <div className="relative mt-5 flex-1 space-y-2">
          <h3 className="font-heading text-2xl leading-[1.1]">{club.title}</h3>
          <p className="text-sm leading-relaxed text-white/80 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-white/95">
            {club.shortDescription || 'Краткое описание программы пока не добавлено.'}
          </p>
        </div>

        <div className="relative mt-6 flex flex-wrap gap-1.5">
          {weekdayPills.map((day, dayIndex) => (
            <span
              className="flex size-7 items-center justify-center rounded-full text-[11px] font-heading text-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1"
              key={dayIndex}
              style={{ backgroundColor: day.color, transitionDelay: `${dayIndex * 40}ms` }}
            >
              {day.label}
            </span>
          ))}
        </div>

        <div className="relative mt-5 inline-flex w-fit flex-col gap-0.5">
          <span className="inline-flex items-center gap-1.5 font-heading text-sm">
            Смотреть расписание
            <ArrowRight className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
          </span>
          <span className="h-px w-0 bg-white/60 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
        </div>
      </Link>
    </MotionReveal>
  )
}

export function ClubCard({ club, priority, index = 0, className }: ClubCardProps) {
  const linkedCategory =
    typeof club.linkToCategory === 'object' && club.linkToCategory !== null ? club.linkToCategory : null
  const href = linkedCategory
    ? getDocumentHref('programCategories', linkedCategory.slug)
    : getDocumentHref('clubs', club.slug)
  const hasOwnCover = Boolean(club.previewImage ?? club.coverImage)

  if (club.slug === SCHEDULE_CARD_SLUG && !hasOwnCover) {
    return <ScheduleCardLink className={className} club={club} href={href} index={index} />
  }

  return (
    <MotionReveal
      amount={0.15}
      className={className}
      delay={index * 0.08}
      duration={0.47}
      margin="-10% 0px -10% 0px"
      y={18}
    >
      <Link
        aria-label={club.title}
        className="group flex h-full flex-col space-y-3 pb-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2"
        href={href}
      >
        <MediaFrame
          alt={club.title}
          aspectClassName="aspect-[16/10]"
          fallbackImageSrc="/seed-media/seed-banner-1.svg"
          imageClassName="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          priority={priority}
          quality={75}
          resource={club.previewImage ?? club.coverImage}
          size="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
        />

        <h3 className="font-heading text-2xl leading-[1.1]">{club.title}</h3>

        <p className="text-sm leading-relaxed text-foreground/80">
          {club.shortDescription || 'Краткое описание программы пока не добавлено.'}
        </p>
      </Link>
    </MotionReveal>
  )
}
