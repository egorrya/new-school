import type { Block } from 'payload'

export const TextImageBlock: Block = {
  slug: 'textImage',
  interfaceName: 'TextImageBlock',
  labels: {
    singular: 'Текст и изображение',
    plural: 'Текст и изображение',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Подзаголовок',
      admin: {
        description: 'Короткая строка над заголовком.',
      },
    },
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
        description: 'Основной текст блока.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Изображение',
      admin: {
        description: 'Иллюстрация рядом с текстом.',
      },
    },
    {
      name: 'imagePosition',
      type: 'select',
      label: 'Позиция изображения',
      required: true,
      options: [
        {
          label: 'Слева',
          value: 'left',
        },
        {
          label: 'Справа',
          value: 'right',
        },
      ],
      admin: {
        description: 'С какой стороны показывать изображение.',
      },
    },
  ],
}
