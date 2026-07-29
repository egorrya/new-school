import type { Block, BlocksField } from 'payload'

import { AudienceBlock } from './AudienceBlock/config'
import { CTAFormBlock } from './CTAFormBlock/config'
import { CollectionGridBlock } from './CollectionGridBlock/config'
import { ContactsBlock } from './ContactsBlock/config'
import { FaqBlock } from './FaqBlock/config'
import { FeatureCardsBlock } from './FeatureCardsBlock/config'
import { HeroBlock } from './HeroBlock/config'
import { MarqueeBlock } from './MarqueeBlock/config'
import { ProgramBlock } from './ProgramBlock/config'
import { ProgramCategoriesBlock } from './ProgramCategoriesBlock/config'
import { ScheduleBlock } from './ScheduleBlock/config'
import { TabsBlock } from './TabsBlock/config'
import { TeacherListBlock } from './TeacherListBlock/config'
import { TestimonialsBlock } from './TestimonialsBlock/config'
import { TextImageBlock } from './TextImageBlock/config'
import { TitleDescriptionBlock } from './TitleDescriptionBlock/config'

export {
  AudienceBlock,
  CTAFormBlock,
  CollectionGridBlock,
  ContactsBlock,
  FaqBlock,
  FeatureCardsBlock,
  HeroBlock,
  MarqueeBlock,
  ProgramBlock,
  ProgramCategoriesBlock,
  ScheduleBlock,
  TabsBlock,
  TeacherListBlock,
  TestimonialsBlock,
  TextImageBlock,
  TitleDescriptionBlock,
}

export const pageBlocks: Block[] = [
  HeroBlock,
  TitleDescriptionBlock,
  MarqueeBlock,
  TextImageBlock,
  FeatureCardsBlock,
  AudienceBlock,
  ProgramBlock,
  ProgramCategoriesBlock,
  ScheduleBlock,
  TabsBlock,
  TeacherListBlock,
  TestimonialsBlock,
  CollectionGridBlock,
  FaqBlock,
  ContactsBlock,
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
