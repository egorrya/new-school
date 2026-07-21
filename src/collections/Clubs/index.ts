import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { publicReadBooleanField } from '../../access/publicRead'
import { defaultLexical } from '@/fields/defaultLexical'

export const Clubs: CollectionConfig<'clubs'> = {
  slug: 'clubs',
  labels: {
    singular: 'Кружок',
    plural: 'Кружки',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: publicReadBooleanField('isActive'),
    update: authenticated,
  },
  admin: {
    group: 'Контент',
    defaultColumns: ['title', 'isActive', 'sortOrder', 'updatedAt'],
    useAsTitle: 'title',
  },
  defaultPopulate: {
    title: true,
    slug: true,
    shortDescription: true,
    coverImage: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название',
      required: true,
    },
    slugField(),
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Краткое описание',
      admin: {
        description: 'Короткий анонс для карточек и списков.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Описание',
      editor: defaultLexical,
    },
    {
      name: 'coverImage',
      type: 'upload',
      label: 'Обложка',
      relationTo: 'media',
    },
    {
      name: 'ageText',
      type: 'text',
      label: 'Возраст',
    },
    {
      name: 'scheduleText',
      type: 'text',
      label: 'Расписание',
    },
    {
      name: 'priceText',
      type: 'text',
      label: 'Стоимость',
    },
    {
      name: 'isActive',
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
