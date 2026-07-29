import type { Block } from 'payload'

export const AudienceBlock: Block = {
  slug: 'audience',
  interfaceName: 'AudienceBlock',
  labels: {
    singular: 'Для кого',
    plural: 'Для кого',
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
        description: 'Короткое описание аудитории.',
      },
    },
    {
      name: 'hideHeader',
      type: 'checkbox',
      label: 'Скрыть заголовок и текст',
      defaultValue: false,
      admin: {
        description: 'Показать только карточки с пунктами, без заголовка и текста над ними.',
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
        description: 'Добавьте пункты для блока.',
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
      ],
    },
  ],
}
