import type { Block, BlocksField } from 'payload'

import { AudienceBlock } from './AudienceBlock/config'
import { BannerSliderBlock } from './BannerSliderBlock/config'
import { CTAFormBlock } from './CTAFormBlock/config'
import { CollectionGridBlock } from './CollectionGridBlock/config'
import { FeatureCardsBlock } from './FeatureCardsBlock/config'
import { HeroBlock } from './HeroBlock/config'
import { MarqueeBlock } from './MarqueeBlock/config'
import { ProgramBlock } from './ProgramBlock/config'
import { ScheduleBlock } from './ScheduleBlock/config'
import { TextImageBlock } from './TextImageBlock/config'

export {
  AudienceBlock,
  BannerSliderBlock,
  CTAFormBlock,
  CollectionGridBlock,
  FeatureCardsBlock,
  HeroBlock,
  MarqueeBlock,
  ProgramBlock,
  ScheduleBlock,
  TextImageBlock,
}

export const pageBlocks: Block[] = [
  HeroBlock,
  MarqueeBlock,
  BannerSliderBlock,
  TextImageBlock,
  FeatureCardsBlock,
  AudienceBlock,
  ProgramBlock,
  ScheduleBlock,
  CollectionGridBlock,
  CTAFormBlock,
]

export const pageLayoutField: BlocksField = {
  name: 'layout',
  type: 'blocks',
  label: 'Блоки страницы',
  admin: {
    description: 'Соберите страницу из готовых блоков.',
    initCollapsed: true,
  },
  blocks: pageBlocks,
}
