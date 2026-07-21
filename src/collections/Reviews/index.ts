import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { publicReadBooleanField } from '../../access/publicRead'

export const Reviews: CollectionConfig<'reviews'> = {
  slug: 'reviews',
  labels: {
    singular: 'Отзыв',
    plural: 'Отзывы',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: publicReadBooleanField('isPublished'),
    update: authenticated,
  },
  admin: {
    group: 'Контент',
    defaultColumns: ['authorName', 'isPublished', 'sortOrder', 'updatedAt'],
    useAsTitle: 'authorName',
  },
  fields: [
    {
      name: 'authorName',
      type: 'text',
      label: 'Автор',
      required: true,
    },
    {
      name: 'authorDescription',
      type: 'text',
      label: 'Описание автора',
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Текст отзыва',
      required: true,
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      label: 'Показывать на сайте',
      defaultValue: false,
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
