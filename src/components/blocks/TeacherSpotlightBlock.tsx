import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type {
  Media as MediaType,
  TeacherSpotlightBlock as TeacherSpotlightBlockType,
} from '@/payload-types'

import { Button } from '@/components/ui/button'
import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockSection,
} from '@/components/shared/PageBlock'
import { MotionReveal } from '@/components/shared/MotionReveal'
import { ScrollTextReveal } from '@/components/shared/ScrollTextReveal'
import { TeacherPhotoWall } from '@/components/blocks/TeacherPhotoWall.client'

import { cn } from '@/utilities/ui'

const STAGGER_STEP = 0.09
const TEACHER_PHOTO_LIMIT = 12
const TEACHER_SCAN_LIMIT = 40

async function getTeacherSpotlightPhotos() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'teachers',
    depth: 1,
    limit: TEACHER_SCAN_LIMIT,
    pagination: false,
    sort: 'sortOrder',
  })

  return result.docs
    .map((teacher) => ({
      name: teacher.name,
      photo: typeof teacher.photo === 'object' ? (teacher.photo as MediaType | null) : null,
    }))
    .filter((entry): entry is { name: string; photo: MediaType } => Boolean(entry.photo))
    .slice(0, TEACHER_PHOTO_LIMIT)
}

export async function TeacherSpotlightBlock({
  eyebrow,
  title,
  text,
  items,
  closingText,
  buttonLabel,
  buttonLink,
  imagePosition,
  insideTabs,
}: TeacherSpotlightBlockType & { insideTabs?: boolean }) {
  const isImageLeft = imagePosition === 'left'
  const checklistItems = items ?? []
  const hasButton = Boolean(buttonLabel && buttonLink)
  const photos = await getTeacherSpotlightPhotos()

  let step = 0
  const nextDelay = () => step++ * STAGGER_STEP

  return (
    <PageBlockSection className="py-14 sm:py-20 lg:py-24">
      <PageBlockContainer container={!insideTabs}>
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2 lg:items-center">
          <div
            className={cn(
              'flex flex-col justify-center gap-6 py-6 sm:p-8 lg:p-10',
              !isImageLeft && 'lg:pr-20',
              isImageLeft && 'lg:order-2',
            )}
          >
            <div className="space-y-3">
              {eyebrow ? (
                <MotionReveal delay={nextDelay()} duration={0.4} y={14}>
                  <p className="font-heading text-sm uppercase tracking-wide text-main sm:text-base">
                    {eyebrow}
                  </p>
                </MotionReveal>
              ) : null}
              {insideTabs ? null : (
                <MotionReveal delay={nextDelay()} duration={0.47} y={18}>
                  <h2 className="max-w-4xl font-heading text-2xl leading-[1.1] sm:text-3xl lg:text-4xl">
                    {title}
                  </h2>
                </MotionReveal>
              )}
              <MotionReveal delay={nextDelay()} duration={0.45} y={16}>
                <p className="max-w-3xl text-base leading-relaxed text-foreground sm:text-lg">
                  {text || 'Основной текст этого блока пока не добавлен.'}
                </p>
              </MotionReveal>
            </div>

            {checklistItems.length > 0 ? (
              <ul className="space-y-2.5">
                {checklistItems.map((item, index) => (
                  <MotionReveal
                    amount={0.4}
                    delay={nextDelay()}
                    duration={0.4}
                    key={item.id || `${item.text}-${index}`}
                    y={14}
                  >
                    <li className="flex items-start gap-2.5 text-base leading-relaxed text-foreground sm:text-lg">
                      <CheckCircle2 aria-hidden="true" className="size-5 shrink-0 text-main" />
                      <span>{item.text}</span>
                    </li>
                  </MotionReveal>
                ))}
              </ul>
            ) : null}

            {hasButton ? (
              <MotionReveal delay={nextDelay()} duration={0.4} y={12}>
                <Button asChild className="w-fit">
                  <Link href={buttonLink || '/'}>{buttonLabel}</Link>
                </Button>
              </MotionReveal>
            ) : null}
          </div>

          <MotionReveal
            className={cn('min-w-0', isImageLeft && 'lg:order-1')}
            delay={nextDelay()}
            duration={0.5}
            y={22}
          >
            {photos.length >= 2 ? (
              <TeacherPhotoWall
                className="aspect-[4/3] min-h-[20rem] lg:aspect-auto lg:min-h-[28rem]"
                names={photos.map((entry) => entry.name)}
                photos={photos.map((entry) => entry.photo)}
              />
            ) : (
              <PageBlockEmptyState
                className="min-h-[20rem] lg:min-h-[28rem]"
                description="Добавьте фото хотя бы двум преподавателям, чтобы здесь появилась лента."
                title="Фото преподавателей пока не добавлены"
              />
            )}
          </MotionReveal>
        </div>

        {closingText ? (
          <ScrollTextReveal
            className="mx-auto max-w-3xl py-14 text-lg leading-[1.75] text-foreground sm:py-[5.6rem] sm:text-2xl lg:max-w-5xl lg:py-[19.6vh] lg:text-3xl"
            text={closingText}
          />
        ) : null}
      </PageBlockContainer>
    </PageBlockSection>
  )
}
