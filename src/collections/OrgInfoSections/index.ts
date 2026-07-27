import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { publicReadBooleanField } from '../../access/publicRead'
import { defaultLexical } from '@/fields/defaultLexical'

export const OrgInfoSections: CollectionConfig<'org-info-sections'> = {
  slug: 'org-info-sections',
  labels: {
    singular: 'Страница сведений',
    plural: 'Сведения об образовательной организации',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: publicReadBooleanField('isPublished'),
    update: authenticated,
  },
  admin: {
    group: 'Контент',
    defaultColumns: ['title', 'sortOrder', 'isPublished', 'updatedAt'],
    useAsTitle: 'title',
  },
  defaultPopulate: {
    title: true,
    slug: true,
    excerpt: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      required: true,
    },
    slugField(),
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Краткое описание',
      admin: {
        description: 'Анонс для карточки в списке разделов.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Текст страницы',
      editor: defaultLexical,
    },
    {
      name: 'documents',
      type: 'array',
      label: 'Документы',
      labels: {
        singular: 'Документ',
        plural: 'Документы',
      },
      admin: {
        description: 'Например, PDF с положением, приказом или отчётом.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Название документа',
          required: true,
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          label: 'Файл',
          required: true,
        },
      ],
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      label: 'Показывать на сайте',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Порядок',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
