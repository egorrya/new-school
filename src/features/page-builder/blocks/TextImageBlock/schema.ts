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
      name: 'items',
      type: 'array',
      label: 'Пункты списка',
      labels: {
        singular: 'Пункт',
        plural: 'Пункты',
      },
      admin: {
        description: 'Необязательно. Список с галочками под основным текстом.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Текст пункта',
          required: true,
        },
      ],
    },
    {
      name: 'closingText',
      type: 'textarea',
      label: 'Текст после списка',
      admin: {
        description: 'Необязательно. Абзац, который идёт после списка пунктов.',
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
      name: 'buttonLabel',
      type: 'text',
      label: 'Текст кнопки',
      admin: {
        description: 'Необязательно. Показывается только если заполнены оба поля.',
      },
    },
    {
      name: 'buttonLink',
      type: 'text',
      label: 'Ссылка кнопки',
      admin: {
        description: 'Адрес для кнопки.',
        condition: (_, siblingData) => Boolean(siblingData?.buttonLabel),
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
