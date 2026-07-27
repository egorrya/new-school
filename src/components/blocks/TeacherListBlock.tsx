import type { Teacher, TeacherListBlock as TeacherListBlockType } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
} from '@/components/shared/PageBlock'
import { MotionReveal } from '@/components/shared/MotionReveal'
import { Badge } from '@/components/ui/badge'

import { cn } from '@/utilities/ui'

function getSelectedTeacherIds(selectedTeachers: TeacherListBlockType['selectedTeachers']) {
  return (selectedTeachers ?? [])
    .map((teacher) => (typeof teacher === 'object' && teacher !== null ? teacher.id : teacher))
    .filter((id): id is number => typeof id === 'number')
}

async function getTeachers({
  itemLimit,
  selectedTeachers,
}: Pick<TeacherListBlockType, 'itemLimit' | 'selectedTeachers'>) {
  const payload = await getPayload({ config: configPromise })
  const selectedIds = getSelectedTeacherIds(selectedTeachers)

  if (selectedIds.length > 0) {
    const result = await payload.find({
      collection: 'teachers',
      depth: 0,
      limit: selectedIds.length,
      pagination: false,
      where: {
        id: {
          in: selectedIds,
        },
      },
    })
    const teachersById = new Map(result.docs.map((teacher) => [teacher.id, teacher as Teacher]))

    return selectedIds
      .map((id) => teachersById.get(id))
      .filter((teacher): teacher is Teacher => Boolean(teacher))
  }

  const result = await payload.find({
    collection: 'teachers',
    depth: 0,
    limit: itemLimit ?? 6,
    pagination: false,
    sort: 'sortOrder',
  })

  return result.docs as Teacher[]
}

export async function TeacherListBlock({
  description,
  itemLimit,
  selectedTeachers,
  title,
}: TeacherListBlockType) {
  const teachers = await getTeachers({ itemLimit, selectedTeachers })

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <div className="space-y-8">
          {title || description ? (
            <PageBlockHeader
              className="mx-auto max-w-4xl text-center"
              description={description}
              descriptionClassName="mx-auto max-w-3xl text-center"
              title={title || 'Наши преподаватели'}
              titleClassName="w-full text-2xl sm:text-3xl lg:text-4xl"
            />
          ) : null}

          {teachers.length > 0 ? (
            <MotionReveal amount={0.35} blur={2} duration={0.47} y={18}>
              <div className="rounded-base border-2 border-border bg-card shadow-shadow">
                {teachers.map((teacher, index) => (
                  <div
                    className={cn(
                      'flex flex-wrap items-baseline gap-x-5 gap-y-2 px-5 py-6 sm:px-8 sm:py-7',
                      index !== teachers.length - 1 && 'border-b-2 border-border',
                    )}
                    key={teacher.id}
                  >
                    <span className="font-base text-sm tabular-nums text-foreground/40 sm:text-base">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="flex-1 font-heading text-2xl leading-[1.1] sm:text-3xl lg:text-4xl">
                      {teacher.name}
                    </h3>
                    {teacher.position ? (
                      <Badge
                        className="text-xs tracking-widest text-foreground/60 uppercase sm:text-sm"
                        variant="neutral"
                      >
                        {teacher.position}
                      </Badge>
                    ) : null}
                  </div>
                ))}
              </div>
            </MotionReveal>
          ) : (
            <PageBlockEmptyState
              description="Добавьте преподавателей в разделе «Преподаватели», чтобы показать список здесь."
              title="Преподаватели пока не добавлены"
            />
          )}
        </div>
      </PageBlockContainer>
    </PageBlockSection>
  )
}
