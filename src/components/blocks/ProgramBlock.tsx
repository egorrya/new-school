import type { ProgramBlock as ProgramBlockType } from '@/payload-types'

import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
} from '@/components/shared/PageBlock'
import { MotionReveal } from '@/components/shared/MotionReveal'

import { Card, CardContent } from '@/components/ui/card'

export function ProgramBlock({ hideHeader, title, description, items }: ProgramBlockType) {
  const programItems = items ?? []

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <div className="space-y-8">
          {hideHeader ? null : (
            <PageBlockHeader
              className="mx-auto max-w-4xl text-center"
              description={description || 'Описание программы пока не заполнено.'}
              descriptionClassName="mx-auto max-w-3xl text-center"
              title={title}
              titleClassName="w-full text-2xl sm:text-3xl lg:text-4xl"
            />
          )}

          {programItems.length > 0 ? (
            <MotionReveal amount={0.35} blur={2} duration={0.47} y={18}>
              <ol className="grid gap-4">
                {programItems.map((item, index) => (
                  <li key={item.id || `${item.title}-${index}`}>
                    <Card className="bg-card">
                      <CardContent className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[auto_1fr] lg:items-start">
                        <div className="flex size-12 items-center justify-center rounded-base border-2 border-border bg-main text-lg font-heading text-main-foreground shadow-shadow">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-heading text-xl leading-[1.1]">{item.title}</h3>
                          <p className="max-w-3xl text-sm leading-relaxed text-foreground/80 sm:text-base">
                            {item.text || 'Подробности этапа пока не добавлены.'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ol>
            </MotionReveal>
          ) : (
            <PageBlockEmptyState
              description="Добавьте этапы программы, чтобы показать структуру обучения."
              title="Этапы программы пока не добавлены"
            />
          )}
        </div>
      </PageBlockContainer>
    </PageBlockSection>
  )
}
