import type { AudienceBlock as AudienceBlockType } from '@/payload-types'

import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
} from '@/components/shared/PageBlock'
import { MotionReveal } from '@/components/shared/MotionReveal'

import { Card, CardContent } from '@/components/ui/card'

import { cn } from '@/utilities/ui'

export function AudienceBlock({ title, text, items }: AudienceBlockType) {
  const audienceItems = items ?? []

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <div className="space-y-8">
          <PageBlockHeader
            className="mx-auto max-w-4xl text-center"
            description={text || 'Короткое описание аудитории пока не заполнено.'}
            descriptionClassName="mx-auto max-w-3xl text-center"
            title={title}
            titleClassName="text-2xl sm:text-3xl lg:text-4xl"
          />

          {audienceItems.length > 0 ? (
            <MotionReveal amount={0.2} duration={0.8} y={18}>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {audienceItems.map((item, index) => (
                  <Card
                    className={cn(
                      'h-full bg-secondary-background/25',
                      index % 3 === 1 && 'bg-background/70',
                    )}
                    key={item.id || `${item.title}-${index}`}
                  >
                    <CardContent className="flex h-full gap-4 p-5 sm:p-6">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-base border-2 border-border bg-main text-lg font-heading text-main-foreground shadow-shadow">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-heading text-xl leading-[1.1]">{item.title}</h3>
                        <p className="text-sm leading-relaxed text-foreground/80">
                          {item.text || 'Пояснение к этому пункту пока не добавлено.'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </MotionReveal>
          ) : (
            <PageBlockEmptyState
              description="Добавьте пункты аудитории, чтобы показать, для кого создана эта программа."
              title="Пункты аудитории пока не добавлены"
            />
          )}
        </div>
      </PageBlockContainer>
    </PageBlockSection>
  )
}
