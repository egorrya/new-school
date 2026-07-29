import type { Teacher, TeacherListBlock as TeacherListBlockType } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
} from '@/components/shared/PageBlock'

import { TeacherListGrid } from './TeacherListBlock.client'

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
      depth: 1,
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
    depth: 1,
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
  insideTabs,
}: TeacherListBlockType & { insideTabs?: boolean }) {
  const teachers = await getTeachers({ itemLimit, selectedTeachers })

  return (
    <PageBlockSection>
      <PageBlockContainer container={!insideTabs}>
        <div className="space-y-8">
          {(insideTabs ? description : title || description) ? (
            <PageBlockHeader
              className={insideTabs ? undefined : 'mx-auto max-w-4xl text-center'}
              description={description}
              descriptionClassName={insideTabs ? 'max-w-3xl' : 'mx-auto max-w-3xl text-center'}
              title={insideTabs ? null : title || 'Наши преподаватели'}
              titleClassName="w-full text-2xl sm:text-3xl lg:text-4xl"
            />
          ) : null}

          {teachers.length > 0 ? (
            <TeacherListGrid teachers={teachers} />
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
