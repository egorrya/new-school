import type { Block } from 'payload'

export const MarqueeBlock: Block = {
  slug: 'marquee',
  interfaceName: 'MarqueeBlock',
  labels: {
    singular: 'Бегущая строка',
    plural: 'Бегущая строка',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Тексты',
      minRows: 1,
      labels: {
        singular: 'Текст',
        plural: 'Тексты',
      },
      admin: {
        description: 'Добавьте фразы для бегущей строки.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Текст',
          required: true,
        },
      ],
    },
  ],
}
