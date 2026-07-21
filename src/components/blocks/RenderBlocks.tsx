import { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { AudienceBlock } from './AudienceBlock'
import { BannerSliderBlock } from './BannerSliderBlock'
import { CTAFormBlock } from './CTAFormBlock'
import { CollectionGridBlock } from './CollectionGridBlock'
import { FeatureCardsBlock } from './FeatureCardsBlock'
import { HeroBlock } from './HeroBlock'
import { MarqueeBlock } from './MarqueeBlock'
import { ProgramBlock } from './ProgramBlock'
import { ScheduleBlock } from './ScheduleBlock'
import { TextImageBlock } from './TextImageBlock'

type PageBlock = NonNullable<Page['layout']>[number]

type RenderBlocksProps = {
  blocks?: Page['layout'] | null
  pageUrl: string
}

function assertNever(value: never): never {
  throw new Error(`Unhandled block type: ${String((value as PageBlock).blockType)}`)
}

function renderBlock(block: PageBlock, pageUrl: string) {
  switch (block.blockType) {
    case 'hero':
      return <HeroBlock {...block} />
    case 'bannerSlider':
      return <BannerSliderBlock {...block} />
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
    case 'collectionGrid':
      return <CollectionGridBlock {...block} />
    case 'ctaForm':
      return <CTAFormBlock {...block} pageUrl={pageUrl} />
    default:
      return assertNever(block)
  }
}

export function RenderBlocks({ blocks, pageUrl }: RenderBlocksProps) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <>
      {blocks.map((block, index) => (
        <Fragment key={block.id || `${block.blockType}-${index}`}>
          {renderBlock(block, pageUrl)}
        </Fragment>
      ))}
    </>
  )
}
