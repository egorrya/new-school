import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'

export const ProgramCategories: CollectionConfig<'programCategories'> = {
  slug: 'programCategories',
  labels: {
    singular: 'Категория программ',
    plural: 'Категории программ',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    group: 'Контент',
    useAsTitle: 'title',
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
      name: 'description',
      type: 'textarea',
      label: 'Описание',
    },
    {
      name: 'previewImage',
      type: 'upload',
      label: 'Картинка для превью',
      relationTo: 'media',
      admin: {
        description: 'Используется как фон карточки категории на странице списка программ.',
      },
    },
  ],
}
