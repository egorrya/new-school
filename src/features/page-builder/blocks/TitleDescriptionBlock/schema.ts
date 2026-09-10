import type { Block } from 'payload'

export const TitleDescriptionBlock: Block = {
  slug: 'titleDescription',
  interfaceName: 'TitleDescriptionBlock',
  labels: {
    singular: 'Заголовок и описание',
    plural: 'Заголовок и описание',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      required: true,
      defaultValue: 'Заголовок страницы',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      admin: {
        description: 'Краткий текст под заголовком.',
      },
    },
  ],
}
