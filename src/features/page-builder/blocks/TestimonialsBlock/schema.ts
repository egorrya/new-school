import type { Block } from 'payload'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: {
    singular: 'Отзывы',
    plural: 'Отзывы',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      defaultValue: 'Отзывы родителей',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      admin: {
        description: 'Короткий текст перед отзывами.',
      },
    },
    {
      name: 'selectedReviews',
      type: 'relationship',
      label: 'Выбранные отзывы',
      relationTo: 'reviews',
      hasMany: true,
      admin: {
        description: 'Оставьте пустым, чтобы показать отзывы автоматически по порядку.',
      },
    },
    {
      name: 'itemLimit',
      type: 'number',
      label: 'Количество отзывов',
      defaultValue: 3,
      min: 1,
      admin: {
        description: 'Используется, если конкретные отзывы не выбраны.',
      },
    },
  ],
}
