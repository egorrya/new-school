import type { Block, BlocksField } from 'payload'

import { AudienceBlock } from './AudienceBlock/config'
import { CTAFormBlock } from './CTAFormBlock/config'
import { CollectionGridBlock } from './CollectionGridBlock/config'
import { FaqBlock } from './FaqBlock/config'
import { FeatureCardsBlock } from './FeatureCardsBlock/config'
import { HeroBlock } from './HeroBlock/config'
import { MarqueeBlock } from './MarqueeBlock/config'
import { ProgramBlock } from './ProgramBlock/config'
import { ScheduleBlock } from './ScheduleBlock/config'
import { TabsBlock } from './TabsBlock/config'
import { TeacherListBlock } from './TeacherListBlock/config'
import { TestimonialsBlock } from './TestimonialsBlock/config'
import { TextImageBlock } from './TextImageBlock/config'

export {
  AudienceBlock,
  CTAFormBlock,
  CollectionGridBlock,
  FaqBlock,
  FeatureCardsBlock,
  HeroBlock,
  MarqueeBlock,
  ProgramBlock,
  ScheduleBlock,
  TabsBlock,
  TeacherListBlock,
  TestimonialsBlock,
  TextImageBlock,
}

export const pageBlocks: Block[] = [
  HeroBlock,
  MarqueeBlock,
  TextImageBlock,
  FeatureCardsBlock,
  AudienceBlock,
  ProgramBlock,
  ScheduleBlock,
  TabsBlock,
  TeacherListBlock,
  TestimonialsBlock,
  CollectionGridBlock,
  FaqBlock,
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
