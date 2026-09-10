import type { Block } from 'payload'

import { AudienceBlock } from '@/features/page-builder/blocks/AudienceBlock/schema'
import { CTAFormBlock } from '@/features/page-builder/blocks/CTAFormBlock/schema'
import { CollectionGridBlock } from '@/features/page-builder/blocks/CollectionGridBlock/schema'
import { FaqBlock } from '@/features/page-builder/blocks/FaqBlock/schema'
import { FeatureCardsBlock } from '@/features/page-builder/blocks/FeatureCardsBlock/schema'
import { ProgramBlock } from '@/features/page-builder/blocks/ProgramBlock/schema'
import { ScheduleBlock } from '@/features/page-builder/blocks/ScheduleBlock/schema'
import { TeacherListBlock } from '@/features/page-builder/blocks/TeacherListBlock/schema'
import { TestimonialsBlock } from '@/features/page-builder/blocks/TestimonialsBlock/schema'
import { TextImageBlock } from '@/features/page-builder/blocks/TextImageBlock/schema'
import { defaultLexical } from '@/cms/fields/defaultLexical'

export const nestedTabBlocks: Block[] = [
  TextImageBlock,
  FeatureCardsBlock,
  AudienceBlock,
  ProgramBlock,
  ScheduleBlock,
  TeacherListBlock,
  TestimonialsBlock,
  CollectionGridBlock,
  FaqBlock,
  CTAFormBlock,
]

export const TabsBlock: Block = {
  slug: 'tabs',
  interfaceName: 'TabsBlock',
  labels: {
    singular: 'Вкладки',
    plural: 'Вкладки',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      admin: {
        description: 'Опциональный заголовок над вкладками.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      admin: {
        description: 'Опциональный текст над вкладками.',
      },
    },
    {
      name: 'hideNavigation',
      type: 'checkbox',
      label: 'Скрыть навигацию по вкладкам',
      defaultValue: false,
      admin: {
        description: 'Вкладки будут отображаться друг за другом, без переключателя сверху.',
      },
    },
    {
      name: 'tabs',
      type: 'array',
      label: 'Вкладки',
      minRows: 1,
      labels: {
        singular: 'Вкладка',
        plural: 'Вкладки',
      },
      admin: {
        description: 'В каждой вкладке можно добавить текст и вложенные screens, кроме самих вкладок.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Название вкладки',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Текст',
          editor: defaultLexical,
        },
        {
          name: 'layout',
          type: 'blocks',
          label: 'Screens во вкладке',
          admin: {
            description: 'Можно добавлять любые screens страницы, кроме блока вкладок.',
            initCollapsed: true,
          },
          blocks: nestedTabBlocks,
        },
      ],
    },
  ],
}
