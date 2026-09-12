import type { Block } from 'payload'

import { defaultLexical } from '@/cms/fields/defaultLexical'

export const DocumentTextBlock: Block = {
  slug: 'documentText',
  interfaceName: 'DocumentTextBlock',
  labels: {
    singular: 'Текстовый документ',
    plural: 'Текстовые документы',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок документа',
      required: true,
    },
    {
      name: 'sections',
      type: 'array',
      label: 'Разделы документа',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок раздела',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Текст раздела',
          editor: defaultLexical,
          required: true,
        },
      ],
    },
  ],
}
