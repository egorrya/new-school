import type { FaqBlock as FaqBlockType } from '@/payload-types'

import { Faq } from '@/components/ui/faq'
import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
} from '@/components/shared/PageBlock'

export function FaqBlock({ title, description, hideTitle, items }: FaqBlockType) {
  const faqItems = items ?? []

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <div className="space-y-8">
          {!hideTitle && (
            <PageBlockHeader
              className="mx-auto max-w-4xl text-center"
              description={description}
              descriptionClassName="mx-auto max-w-3xl text-center"
              title={title}
              titleClassName="w-full text-2xl sm:text-3xl lg:text-4xl"
            />
          )}

          {faqItems.length > 0 ? (
            <div className="mx-auto max-w-3xl">
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
