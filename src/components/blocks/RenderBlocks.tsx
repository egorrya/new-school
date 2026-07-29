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
  insideTabs?: boolean
}

function assertNever(value: never): never {
  throw new Error(`Unhandled block type: ${String((value as PageBlock).blockType)}`)
}

function renderBlock(
  block: PageBlock,
  pageUrl: string,
  isFirstBlock: boolean,
  nextBlock?: PageBlock,
  previousBlock?: PageBlock,
  clubId?: number | null,
  insideTabs?: boolean,
) {
  switch (block.blockType) {
    case 'hero':
      return <HeroBlock {...block} fullScreen={isFirstBlock} />
    case 'titleDescription':
      return (
        <TitleDescriptionBlock
          {...block}
          compactAfter={nextBlock?.blockType === 'programCategories'}
        />
      )
    case 'marquee':
      return <MarqueeBlock {...block} />
    case 'textImage':
      return <TextImageBlock {...block} insideTabs={insideTabs} />
    case 'featureCards':
      return <FeatureCardsBlock {...block} insideTabs={insideTabs} />
    case 'audience':
      return <AudienceBlock {...block} insideTabs={insideTabs} />
    case 'program':
      return <ProgramBlock {...block} insideTabs={insideTabs} />
    case 'programCategories':
      return (
        <ProgramCategoriesBlock
          {...block}
          hasMobileTopGap={previousBlock?.blockType === 'marquee'}
        />
      )
    case 'schedule':
      return <ScheduleBlock {...block} insideTabs={insideTabs} />
    case 'tabs':
      return <TabsBlock {...block} clubId={clubId} pageUrl={pageUrl} />
    case 'teacherList':
      return <TeacherListBlock {...block} insideTabs={insideTabs} />
    case 'testimonials':
      return <TestimonialsBlock {...block} insideTabs={insideTabs} />
    case 'collectionGrid':
      return <CollectionGridBlock {...block} insideTabs={insideTabs} />
    case 'faq':
      return <FaqBlock {...block} insideTabs={insideTabs} />
    case 'contacts':
      return <ContactsBlock {...block} />
    case 'ctaForm':
      return <CTAFormBlock {...block} clubId={clubId} insideTabs={insideTabs} pageUrl={pageUrl} />
    default:
      return assertNever(block)
  }
}

export function RenderBlocks({
  blocks,
  pageUrl,
  allowFullScreenHero = true,
  clubId,
  insideTabs,
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
            : renderBlock(
                block,
                pageUrl,
                allowFullScreenHero && index === 0,
                blocks[index + 1],
                blocks[index - 1],
                clubId,
                insideTabs,
              )}
        </Fragment>
      ))}
    </>
  )
}
