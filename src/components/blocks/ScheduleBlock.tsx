import type { ScheduleBlock as ScheduleBlockType } from '@/payload-types'

import { Card, CardContent } from '@/components/ui/card'

import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
} from '@/components/shared/PageBlock'
import { MotionReveal } from '@/components/shared/MotionReveal'

import { cn } from '@/utilities/ui'

export function ScheduleBlock({ hideHeader, title, description, scheduleItems }: ScheduleBlockType) {
  const items = scheduleItems ?? []

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <div className="space-y-8">
          {hideHeader ? null : (
            <PageBlockHeader
              className="mx-auto max-w-4xl text-center"
              description={description || 'Расписание этого блока пока не заполнено.'}
              descriptionClassName="mx-auto max-w-3xl text-center"
              title={title}
              titleClassName="w-full text-2xl sm:text-3xl lg:text-4xl"
            />
          )}

          {items.length > 0 ? (
            <MotionReveal amount={0.35} blur={2} duration={0.47} y={18}>
              <Card className="overflow-hidden bg-background/70">
                <CardContent className="p-0">
                  <dl>
                    {items.map((item, index) => (
                      <div
                        className={cn(
                          'grid gap-2 p-5 sm:p-6 md:grid-cols-[minmax(12rem,0.42fr)_1fr] md:gap-6',
                          index !== items.length - 1 && 'border-b-2 border-border',
                          index % 2 === 1 && 'bg-secondary-background/25',
                        )}
                        key={item.id || `${item.label}-${index}`}
                      >
                        <dt className="font-heading text-lg leading-tight">{item.label}</dt>
                        <dd className="text-sm leading-relaxed text-foreground/80 sm:text-base">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            </MotionReveal>
          ) : (
            <PageBlockEmptyState
              description="Добавьте строки расписания, чтобы показать режим работы или учебный график."
              title="Расписание пока не добавлено"
            />
          )}
        </div>
      </PageBlockContainer>
    </PageBlockSection>
  )
}
