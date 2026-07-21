import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { publicReadPublishedAt } from '../../access/publicRead'
import { defaultLexical } from '@/fields/defaultLexical'

export const News: CollectionConfig<'news'> = {
  slug: 'news',
  labels: {
    singular: 'Новость',
    plural: 'Новости',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: publicReadPublishedAt,
    update: authenticated,
  },
  admin: {
    group: 'Контент',
    defaultColumns: ['title', 'publishedAt', 'updatedAt'],
    useAsTitle: 'title',
  },
  defaultPopulate: {
    title: true,
    slug: true,
    excerpt: true,
    coverImage: true,
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
        description: 'Анонс для карточек и выдачи новостей.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Текст новости',
      editor: defaultLexical,
    },
    {
      name: 'coverImage',
      type: 'upload',
      label: 'Обложка',
      relationTo: 'media',
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Дата публикации',
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
    },
  ],
}
