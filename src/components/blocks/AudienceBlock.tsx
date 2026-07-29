import type { AudienceBlock as AudienceBlockType } from '@/payload-types'

import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
} from '@/components/shared/PageBlock'
import { MotionReveal } from '@/components/shared/MotionReveal'

export function AudienceBlock({
  hideHeader,
  title,
  text,
  items,
  insideTabs,
}: AudienceBlockType & { insideTabs?: boolean }) {
  const audienceItems = items ?? []

  return (
    <PageBlockSection>
      <PageBlockContainer container={!insideTabs}>
        <div className="space-y-8">
          {hideHeader ? null : (
            <PageBlockHeader
              className={insideTabs ? undefined : 'mx-auto max-w-4xl text-center'}
              description={text || 'Короткое описание аудитории пока не заполнено.'}
              descriptionClassName={insideTabs ? 'max-w-3xl' : 'mx-auto max-w-3xl text-center'}
              title={insideTabs ? null : title}
              titleClassName="text-2xl sm:text-3xl lg:text-4xl"
            />
          )}

          {audienceItems.length === 1 ? (
            <MotionReveal amount={0.35} blur={2} duration={0.47} y={18}>
              <div className="mx-auto max-w-3xl space-y-2">
                <h3 className="font-heading text-xl leading-[1.1]">{audienceItems[0].title}</h3>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {audienceItems[0].text || 'Пояснение к этому пункту пока не добавлено.'}
                </p>
              </div>
            </MotionReveal>
          ) : audienceItems.length > 0 ? (
            <MotionReveal amount={0.35} blur={2} duration={0.47} y={18}>
              <div className="flex flex-wrap justify-center gap-6">
                {audienceItems.map((item, index) => {
                  const stackSingleColumn = insideTabs && audienceItems.length === 3
                  const isLastOfOddPair =
                    insideTabs &&
                    !stackSingleColumn &&
                    audienceItems.length % 2 === 1 &&
                    index === audienceItems.length - 1

                  return (
                    <div
                      className={
                        insideTabs
                          ? stackSingleColumn
                            ? 'flex w-full gap-4'
                            : isLastOfOddPair
                              ? 'mx-auto flex w-full gap-4 sm:max-w-[calc(50%-0.75rem)]'
                              : 'flex w-full gap-4 sm:w-[calc(50%-0.75rem)]'
                          : 'flex w-full gap-4 md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333%-1rem)]'
                      }
                      key={item.id || `${item.title}-${index}`}
                    >
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-base border-2 border-border bg-main text-lg font-heading text-main-foreground shadow-shadow">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-heading text-xl leading-[1.1]">{item.title}</h3>
                        <p className="text-sm leading-relaxed text-foreground/80">
                          {item.text || 'Пояснение к этому пункту пока не добавлено.'}
                        </p>
                      </div>
                    </div>
                  )
                })}
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
