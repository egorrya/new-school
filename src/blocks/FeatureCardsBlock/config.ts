import type { Block } from 'payload'

export const FeatureCardsBlock: Block = {
  slug: 'featureCards',
  interfaceName: 'FeatureCardsBlock',
  labels: {
    singular: 'Преимущества',
    plural: 'Преимущества',
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
        description: 'Краткий текст перед пунктами.',
      },
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Пункты',
      minRows: 1,
      labels: {
        singular: 'Пункт',
        plural: 'Пункты',
      },
      admin: {
        description: 'Добавьте столько пунктов, сколько нужно.',
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
            description: 'Короткое пояснение к пункту.',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Изображение',
          admin: {
            description: 'Иллюстрация для пункта.',
          },
        },
        {
          name: 'iconName',
          type: 'text',
          label: 'Иконка',
          admin: {
            description: 'Например: book-open.',
          },
        },
      ],
    },
  ],
}
