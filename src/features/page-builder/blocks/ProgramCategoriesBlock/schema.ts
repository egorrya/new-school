import type { Block } from 'payload'

export const ProgramCategoriesBlock: Block = {
  slug: 'programCategories',
  interfaceName: 'ProgramCategoriesBlock',
  labels: {
    singular: 'Категории программ',
    plural: 'Категории программ',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      defaultValue: 'Категории программ',
    },
    {
      name: 'hideTitle',
      type: 'checkbox',
      label: 'Скрыть заголовок',
      admin: {
        description: 'Если отмечено, заголовок не будет отображаться.',
      },
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
