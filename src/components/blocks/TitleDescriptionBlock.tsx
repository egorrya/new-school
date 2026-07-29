import type { TitleDescriptionBlock as TitleDescriptionBlockType } from '@/payload-types'

import {
  PageBlockContainer,
  PageBlockHeader,
  PageBlockSection,
} from '@/components/shared/PageBlock'

export function TitleDescriptionBlock({ description, title }: TitleDescriptionBlockType) {
  return (
    <PageBlockSection>
      <PageBlockContainer>
        <PageBlockHeader
          className="mx-auto max-w-4xl text-center"
          description={description}
          descriptionClassName="mx-auto max-w-3xl text-center"
          headingLevel={1}
          title={title}
          titleClassName="mx-auto text-2xl sm:text-3xl lg:text-4xl"
        />
      </PageBlockContainer>
    </PageBlockSection>
  )
}
