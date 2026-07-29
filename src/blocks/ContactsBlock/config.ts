import type { Block } from 'payload'

export const ContactsBlock: Block = {
  slug: 'contacts',
  interfaceName: 'ContactsBlock',
  labels: {
    singular: 'Контакты',
    plural: 'Контакты',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Текст',
      admin: {
        description: 'Короткое пояснение над контактами.',
      },
    },
  ],
}
