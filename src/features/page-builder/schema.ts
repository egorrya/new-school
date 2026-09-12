import type { Block, BlocksField } from 'payload'

import { AudienceBlock } from './blocks/AudienceBlock/schema'
import { CTAFormBlock } from './blocks/CTAFormBlock/schema'
import { CollectionGridBlock } from './blocks/CollectionGridBlock/schema'
import { ContactsBlock } from './blocks/ContactsBlock/schema'
import { DocumentTextBlock } from './blocks/DocumentTextBlock/schema'
import { FaqBlock } from './blocks/FaqBlock/schema'
import { FeatureCardsBlock } from './blocks/FeatureCardsBlock/schema'
import { HeroBlock } from './blocks/HeroBlock/schema'
import { HeroMarqueeBlock } from './blocks/HeroMarqueeBlock/schema'
import { MarqueeBlock } from './blocks/MarqueeBlock/schema'
import { ProgramBlock } from './blocks/ProgramBlock/schema'
import { ProgramCategoriesBlock } from './blocks/ProgramCategoriesBlock/schema'
import { ScheduleBlock } from './blocks/ScheduleBlock/schema'
import { SchoolLifeBlock } from './blocks/SchoolLifeBlock/schema'
import { TabsBlock } from './blocks/TabsBlock/schema'
import { TeacherListBlock } from './blocks/TeacherListBlock/schema'
import { TeacherSpotlightBlock } from './blocks/TeacherSpotlightBlock/schema'
import { TestimonialsBlock } from './blocks/TestimonialsBlock/schema'
import { TextImageBlock } from './blocks/TextImageBlock/schema'
import { TitleDescriptionBlock } from './blocks/TitleDescriptionBlock/schema'

export {
  AudienceBlock,
  CTAFormBlock,
  CollectionGridBlock,
  ContactsBlock,
  DocumentTextBlock,
  FaqBlock,
  FeatureCardsBlock,
  HeroBlock,
  HeroMarqueeBlock,
  MarqueeBlock,
  ProgramBlock,
  ProgramCategoriesBlock,
  ScheduleBlock,
  SchoolLifeBlock,
  TabsBlock,
  TeacherListBlock,
  TeacherSpotlightBlock,
  TestimonialsBlock,
  TextImageBlock,
  TitleDescriptionBlock,
}

export const pageBlocks: Block[] = [
  HeroBlock,
  HeroMarqueeBlock,
  TitleDescriptionBlock,
  DocumentTextBlock,
  MarqueeBlock,
  TextImageBlock,
  FeatureCardsBlock,
  AudienceBlock,
  ProgramBlock,
  ProgramCategoriesBlock,
  ScheduleBlock,
  SchoolLifeBlock,
  TabsBlock,
  TeacherListBlock,
  TeacherSpotlightBlock,
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
