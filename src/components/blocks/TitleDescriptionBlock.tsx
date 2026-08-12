import type { TitleDescriptionBlock as TitleDescriptionBlockType } from '@/payload-types'

import {
  PageBlockContainer,
  PageBlockHeader,
  PageBlockSection,
} from '@/components/shared/PageBlock'
import { cn } from '@/utilities/ui'

export function TitleDescriptionBlock({
  compactAfter,
  description,
  title,
}: TitleDescriptionBlockType & { compactAfter?: boolean }) {
  return (
    <PageBlockSection
      className={cn(compactAfter && 'pt-8 pb-10 sm:pt-12 sm:pb-10 lg:pt-16 lg:pb-12')}
      spacing={compactAfter ? 'none' : 'default'}
    >
      <PageBlockContainer>
        <PageBlockHeader
          className="mx-auto max-w-4xl text-center"
          description={description}
          descriptionClassName="mx-auto max-w-3xl text-center"
          headingLevel={1}
          title={title}
          titleClassName="mx-auto text-2xl sm:text-3xl lg:text-4xl"
          titleDuration={compactAfter ? 0.9 : undefined}
          titleY={compactAfter ? 26 : undefined}
        />
      </PageBlockContainer>
    </PageBlockSection>
  )
}
