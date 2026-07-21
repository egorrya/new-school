import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: {
    singular: 'Первый экран',
    plural: 'Первый экран',
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
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      admin: {
        description: 'Краткий текст под заголовком.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Изображение',
      admin: {
        description: 'Основное изображение первого экрана.',
      },
    },
    {
      name: 'primaryButtonLabel',
      type: 'text',
      label: 'Текст первой кнопки',
      required: true,
    },
    {
      name: 'primaryButtonLink',
      type: 'text',
      label: 'Ссылка первой кнопки',
      required: true,
      admin: {
        description: 'Адрес для первой кнопки.',
      },
    },
    {
      name: 'secondaryButtonLabel',
      type: 'text',
      label: 'Текст второй кнопки',
    },
    {
      name: 'secondaryButtonLink',
      type: 'text',
      label: 'Ссылка второй кнопки',
      admin: {
        description: 'Адрес для второй кнопки.',
      },
    },
  ],
}
