import { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { AudienceBlock } from './AudienceBlock'
import { CTAFormBlock } from './CTAFormBlock'
import { CollectionGridBlock } from './CollectionGridBlock'
import { FaqBlock } from './FaqBlock'
import { FeatureCardsBlock } from './FeatureCardsBlock'
import { HeroBlock } from './HeroBlock'
import { MarqueeBlock } from './MarqueeBlock'
import { ProgramBlock } from './ProgramBlock'
import { ScheduleBlock } from './ScheduleBlock'
import { TabsBlock } from './TabsBlock'
import { TeacherListBlock } from './TeacherListBlock'
import { TestimonialsBlock } from './TestimonialsBlock'
import { TextImageBlock } from './TextImageBlock'

type PageBlock = NonNullable<Page['layout']>[number]

type RenderBlocksProps = {
  blocks?: Page['layout'] | null
  pageUrl: string
  allowFullScreenHero?: boolean
}

function assertNever(value: never): never {
  throw new Error(`Unhandled block type: ${String((value as PageBlock).blockType)}`)
}

function renderBlock(block: PageBlock, pageUrl: string, isFirstBlock: boolean) {
  switch (block.blockType) {
    case 'hero':
      return <HeroBlock {...block} fullScreen={isFirstBlock} />
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
    case 'schedule':
      return <ScheduleBlock {...block} />
    case 'tabs':
      return <TabsBlock {...block} pageUrl={pageUrl} />
    case 'teacherList':
      return <TeacherListBlock {...block} />
    case 'testimonials':
      return <TestimonialsBlock {...block} />
    case 'collectionGrid':
      return <CollectionGridBlock {...block} />
    case 'faq':
      return <FaqBlock {...block} />
    case 'ctaForm':
      return <CTAFormBlock {...block} pageUrl={pageUrl} />
    default:
      return assertNever(block)
  }
}

export function RenderBlocks({ blocks, pageUrl, allowFullScreenHero = true }: RenderBlocksProps) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <>
      {blocks.map((block, index) => (
        <Fragment key={block.id || `${block.blockType}-${index}`}>
          {(block as { blockType?: string }).blockType === 'bannerSlider'
            ? null
            : renderBlock(block, pageUrl, allowFullScreenHero && index === 0)}
        </Fragment>
      ))}
    </>
  )
}
