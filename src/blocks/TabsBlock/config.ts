import type { Block } from 'payload'

import { AudienceBlock } from '@/blocks/AudienceBlock/config'
import { CTAFormBlock } from '@/blocks/CTAFormBlock/config'
import { CollectionGridBlock } from '@/blocks/CollectionGridBlock/config'
import { FaqBlock } from '@/blocks/FaqBlock/config'
import { FeatureCardsBlock } from '@/blocks/FeatureCardsBlock/config'
import { ProgramBlock } from '@/blocks/ProgramBlock/config'
import { ScheduleBlock } from '@/blocks/ScheduleBlock/config'
import { TeacherListBlock } from '@/blocks/TeacherListBlock/config'
import { TestimonialsBlock } from '@/blocks/TestimonialsBlock/config'
import { TextImageBlock } from '@/blocks/TextImageBlock/config'
import { defaultLexical } from '@/fields/defaultLexical'

const nestedTabBlocks: Block[] = [
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
