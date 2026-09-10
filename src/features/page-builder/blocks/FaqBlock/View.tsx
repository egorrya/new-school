import type { FaqBlock as FaqBlockType } from '@/payload-types'

import { Faq } from '@/shared/ui/primitives/faq'
import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
} from '@/shared/components/PageBlock'

export function FaqBlock({
  title,
  description,
  hideTitle,
  items,
  insideTabs,
}: FaqBlockType & { insideTabs?: boolean }) {
  const faqItems = items ?? []

  return (
    <PageBlockSection>
      <PageBlockContainer container={!insideTabs}>
        <div className="space-y-8">
          {!hideTitle && (
            <PageBlockHeader
              className={insideTabs ? undefined : 'mx-auto max-w-4xl text-center'}
              description={description}
              descriptionClassName={insideTabs ? 'max-w-3xl' : 'mx-auto max-w-3xl text-center'}
              title={insideTabs ? null : title}
              titleClassName="w-full text-2xl sm:text-3xl lg:text-4xl"
            />
          )}

          {faqItems.length > 0 ? (
            <div className={insideTabs ? undefined : 'mx-auto max-w-3xl'}>
              <Faq items={faqItems} />
            </div>
          ) : (
            <PageBlockEmptyState
              description="Добавьте вопросы и ответы, чтобы показать их посетителям сайта."
              title="Вопросы пока не добавлены"
            />
          )}
        </div>
      </PageBlockContainer>
    </PageBlockSection>
  )
}
