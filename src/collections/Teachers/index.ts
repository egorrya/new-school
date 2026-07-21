import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'
import { defaultLexical } from '@/fields/defaultLexical'

export const Teachers: CollectionConfig<'teachers'> = {
  slug: 'teachers',
  labels: {
    singular: 'Преподаватель',
    plural: 'Преподаватели',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Контент',
    defaultColumns: ['name', 'position', 'sortOrder', 'updatedAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Имя',
      required: true,
    },
    {
      name: 'position',
      type: 'text',
      label: 'Должность',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Описание',
      editor: defaultLexical,
    },
    {
      name: 'photo',
      type: 'upload',
      label: 'Фото',
      relationTo: 'media',
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
