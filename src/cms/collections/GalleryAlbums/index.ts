import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'

export const GalleryAlbums: CollectionConfig<'gallery-albums'> = {
  slug: 'gallery-albums',
  labels: {
    singular: 'Альбом',
    plural: 'Галерея',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Контент',
    defaultColumns: ['title', 'sortOrder', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
    },
    {
      name: 'images',
      type: 'relationship',
      hasMany: true,
      label: 'Изображения',
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
