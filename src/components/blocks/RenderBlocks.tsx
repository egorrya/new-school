import { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { AudienceBlock } from './AudienceBlock'
import { CTAFormBlock } from './CTAFormBlock'
import { CollectionGridBlock } from './CollectionGridBlock'
import { ContactsBlock } from './ContactsBlock'
import { FaqBlock } from './FaqBlock'
import { FeatureCardsBlock } from './FeatureCardsBlock'
import { HeroBlock } from './HeroBlock'
import { MarqueeBlock } from './MarqueeBlock'
import { ProgramBlock } from './ProgramBlock'
import { ProgramCategoriesBlock } from './ProgramCategoriesBlock'
import { ScheduleBlock } from './ScheduleBlock'
import { TabsBlock } from './TabsBlock'
import { TeacherListBlock } from './TeacherListBlock'
import { TestimonialsBlock } from './TestimonialsBlock'
import { TextImageBlock } from './TextImageBlock'
import { TitleDescriptionBlock } from './TitleDescriptionBlock'

type PageBlock = NonNullable<Page['layout']>[number]

type RenderBlocksProps = {
  blocks?: Page['layout'] | null
  pageUrl: string
  allowFullScreenHero?: boolean
  clubId?: number | null
}

function assertNever(value: never): never {
  throw new Error(`Unhandled block type: ${String((value as PageBlock).blockType)}`)
}

function renderBlock(
  block: PageBlock,
  pageUrl: string,
  isFirstBlock: boolean,
  clubId?: number | null,
) {
  switch (block.blockType) {
    case 'hero':
      return <HeroBlock {...block} fullScreen={isFirstBlock} />
    case 'titleDescription':
      return <TitleDescriptionBlock {...block} />
    case 'marquee':
      return <MarqueeBlock {...block} />
    case 'textImage':
      return <TextImageBlock {...block} />
    case 'featureCards':
      return <FeatureCardsBlock {...block} />
    case 'audience':
      return <AudienceBlock {...block} />
    case 'program':
      return <ProgramBlock {...block} />
    case 'programCategories':
      return <ProgramCategoriesBlock {...block} />
    case 'schedule':
      return <ScheduleBlock {...block} />
    case 'tabs':
      return <TabsBlock {...block} clubId={clubId} pageUrl={pageUrl} />
    case 'teacherList':
      return <TeacherListBlock {...block} />
    case 'testimonials':
      return <TestimonialsBlock {...block} />
    case 'collectionGrid':
      return <CollectionGridBlock {...block} />
    case 'faq':
      return <FaqBlock {...block} />
    case 'contacts':
      return <ContactsBlock {...block} />
    case 'ctaForm':
      return <CTAFormBlock {...block} clubId={clubId} pageUrl={pageUrl} />
    default:
      return assertNever(block)
  }
}

export function RenderBlocks({
  blocks,
  pageUrl,
  allowFullScreenHero = true,
  clubId,
}: RenderBlocksProps) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <>
      {blocks.map((block, index) => (
        <Fragment key={block.id || `${block.blockType}-${index}`}>
          {(block as { blockType?: string }).blockType === 'bannerSlider'
            ? null
            : renderBlock(block, pageUrl, allowFullScreenHero && index === 0, clubId)}
        </Fragment>
      ))}
    </>
  )
}
