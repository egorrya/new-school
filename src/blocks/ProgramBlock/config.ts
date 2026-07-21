import type { Block } from 'payload'

export const ProgramBlock: Block = {
  slug: 'program',
  interfaceName: 'ProgramBlock',
  labels: {
    singular: 'Программа',
    plural: 'Программа',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      admin: {
        description: 'Краткий текст перед программой.',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Пункты',
      minRows: 1,
      labels: {
        singular: 'Пункт',
        plural: 'Пункты',
      },
      admin: {
        description: 'Добавьте пункты программы.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок',
          required: true,
        },
        {
          name: 'text',
          type: 'textarea',
          label: 'Текст',
          admin: {
            description: 'Краткое описание этапа или темы.',
          },
        },
      ],
    },
  ],
}
