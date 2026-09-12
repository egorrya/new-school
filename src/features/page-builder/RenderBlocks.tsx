import { Fragment } from 'react'

import type { Media, News, Page } from '@/payload-types'

import { AudienceBlock } from './blocks/AudienceBlock/View'
import { CTAFormBlock } from './blocks/CTAFormBlock/View'
import { CollectionGridBlock } from './blocks/CollectionGridBlock/View'
import { ContactsBlock } from './blocks/ContactsBlock/View'
import { DocumentTextBlock } from './blocks/DocumentTextBlock/View'
import { FaqBlock } from './blocks/FaqBlock/View'
import { FeatureCardsBlock } from './blocks/FeatureCardsBlock/View'
import { HeroBlock } from './blocks/HeroBlock/View'
import { HeroMarqueeBlock } from './blocks/HeroMarqueeBlock/View'
import { MarqueeBlock } from './blocks/MarqueeBlock/View'
import { ProgramBlock } from './blocks/ProgramBlock/View'
import { ProgramCategoriesBlock } from './blocks/ProgramCategoriesBlock/View'
import { ScheduleBlock } from './blocks/ScheduleBlock/View'
import { SchoolLifeBlock } from './blocks/SchoolLifeBlock/View'
import { TabsBlock } from './blocks/TabsBlock/View'
import { TeacherListBlock } from './blocks/TeacherListBlock/View'
import { TeacherSpotlightBlock } from './blocks/TeacherSpotlightBlock/View'
import { TestimonialsBlock } from './blocks/TestimonialsBlock/View'
import { TextImageBlock } from './blocks/TextImageBlock/View'
import { TitleDescriptionBlock } from './blocks/TitleDescriptionBlock/View'

type PageBlock = NonNullable<Page['layout']>[number]

type RenderBlocksProps = {
  blocks?: Page['layout'] | null
  pageUrl: string
  latestNews?: News | null
  marqueeImages?: Media[]
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
  latestNews?: News | null,
  marqueeImages?: Media[],
  clubId?: number | null,
  insideTabs?: boolean,
) {
  switch (block.blockType) {
    case 'hero':
      return <HeroBlock {...block} fullScreen={isFirstBlock} latestNews={latestNews} />
    case 'heroMarquee':
      return (
        <HeroMarqueeBlock
          {...block}
          fullScreen={isFirstBlock}
          latestNews={latestNews}
          marqueeImages={marqueeImages}
        />
      )
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
    case 'schoolLife':
      return <SchoolLifeBlock {...block} />
    case 'tabs':
      return <TabsBlock {...block} clubId={clubId} pageUrl={pageUrl} />
    case 'teacherList':
      return <TeacherListBlock {...block} insideTabs={insideTabs} />
    case 'teacherSpotlight':
      return <TeacherSpotlightBlock {...block} insideTabs={insideTabs} />
    case 'testimonials':
      return <TestimonialsBlock {...block} insideTabs={insideTabs} />
    case 'collectionGrid':
      return <CollectionGridBlock {...block} insideTabs={insideTabs} />
    case 'faq':
      return <FaqBlock {...block} insideTabs={insideTabs} />
    case 'contacts':
      return <ContactsBlock {...block} />
    case 'documentText':
      return <DocumentTextBlock {...block} />
    case 'ctaForm':
      return <CTAFormBlock {...block} clubId={clubId} insideTabs={insideTabs} pageUrl={pageUrl} />
    default:
      return assertNever(block)
  }
}

export function RenderBlocks({
  blocks,
  pageUrl,
  latestNews,
  marqueeImages,
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
          {renderBlock(
            block,
            pageUrl,
            allowFullScreenHero && index === 0,
            blocks[index + 1],
            blocks[index - 1],
            latestNews,
            marqueeImages,
            clubId,
            insideTabs,
          )}
        </Fragment>
      ))}
    </>
  )
}
