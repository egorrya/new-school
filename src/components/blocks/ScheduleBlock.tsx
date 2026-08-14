import type { Club, ScheduleBlock as ScheduleBlockType } from '@/payload-types'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'
import { MediaFrame } from '@/components/shared/MediaFrame'

import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
} from '@/components/shared/PageBlock'
import { MotionReveal } from '@/components/shared/MotionReveal'
import { getDocumentHref } from '@/utilities/getDocumentHref'

import { cn } from '@/utilities/ui'

function getClubHref(club: Club) {
  const linkedCategory =
    typeof club.linkToCategory === 'object' && club.linkToCategory !== null ? club.linkToCategory : null

  return linkedCategory
    ? getDocumentHref('programCategories', linkedCategory.slug)
    : getDocumentHref('clubs', club.slug)
}

export function ScheduleBlock({
  hideHeader,
  hideTitle,
  title,
  description,
  scheduleItems,
  viewAllLink,
  viewAllLabel,
  insideTabs,
}: ScheduleBlockType & { insideTabs?: boolean }) {
  const items = scheduleItems ?? []

  return (
    <PageBlockSection>
      <PageBlockContainer container={!insideTabs}>
        <div className="space-y-8">
          {hideHeader ? null : (
            <PageBlockHeader
              className={insideTabs ? undefined : 'mx-auto max-w-4xl text-center'}
              description={description || 'Расписание этого блока пока не заполнено.'}
              descriptionClassName={insideTabs ? 'max-w-3xl' : 'mx-auto max-w-3xl text-center'}
              headingLevel={insideTabs ? 4 : 2}
              title={insideTabs || hideTitle ? null : title}
              titleClassName={
                insideTabs
                  ? 'w-full text-sm font-medium text-foreground/70 sm:text-base'
                  : 'w-full text-2xl sm:text-3xl lg:text-4xl'
              }
            />
          )}

          {items.length > 0 ? (
            <MotionReveal amount={0.12} duration={0.47} y={18}>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <ul>
                    {items.map((item, index) => {
                      const club = typeof item.club === 'object' && item.club !== null ? item.club : null

                      return (
                        <li
                          className={cn(index !== items.length - 1 && 'border-b border-border')}
                          key={item.id || `${item.label}-${index}`}
                        >
                          {club ? (
                            <Link
                              className="group flex items-center gap-4 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-secondary-background/40 sm:gap-5"
                              href={getClubHref(club)}
                            >
                              <MediaFrame
                                alt={club.title}
                                aspectClassName="aspect-square"
                                className="size-24 shrink-0 rounded-none sm:size-32"
                                fallbackImageSrc="/seed-media/seed-banner-1.svg"
                                imageClassName="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                                resource={club.previewImage ?? club.coverImage}
                              />

                              <div className="flex min-w-0 flex-1 items-center gap-4 py-5 pr-4 sm:gap-5 sm:py-6 sm:pr-6">
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-heading text-lg leading-tight sm:text-xl">
                                    {club.title}
                                  </p>
                                  {item.label ? (
                                    <p className="mt-1 truncate text-sm text-foreground/70">{item.label}</p>
                                  ) : null}
                                </div>

                                <span className="shrink-0 rounded-base border border-border bg-secondary-background px-3 py-1.5 font-heading text-sm">
                                  {item.value}
                                </span>

                                <ChevronRight className="size-5 shrink-0 text-foreground/30 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:text-foreground/60" />
                              </div>
                            </Link>
                          ) : (
                            <div className="grid gap-2 p-5 sm:p-6 md:grid-cols-[minmax(12rem,0.42fr)_1fr] md:gap-6">
                              <p className="font-heading text-lg leading-tight">{item.label}</p>
                              <p className="text-sm leading-relaxed text-foreground/80 sm:text-base">
                                {item.value}
                              </p>
                            </div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </CardContent>
              </Card>
            </MotionReveal>
          ) : (
            <PageBlockEmptyState
              description="Добавьте строки расписания, чтобы показать режим работы или учебный график."
              title="Расписание пока не добавлено"
            />
          )}

          {viewAllLink ? (
            <p className="text-center text-sm text-foreground/70">
              <Link
                className="font-heading text-foreground underline underline-offset-4 transition-colors hover:text-foreground/70"
                href={viewAllLink}
              >
                {viewAllLabel || 'Посмотреть расписание всех кружков'}
              </Link>
            </p>
          ) : null}
        </div>
      </PageBlockContainer>
    </PageBlockSection>
  )
}
