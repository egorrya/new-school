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
    defaultColumns: ['title', 'isActive', 'sortOrder', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название',
      required: true,
      admin: {
        description:
          'Используется в карточках и списках категорий. Не влияет на заголовок страницы категории — для него есть отдельное поле ниже.',
      },
    },
    slugField(),
    {
      name: 'pageTitle',
      type: 'text',
      label: 'Заголовок на странице категории',
      admin: {
        description:
          'Выводится как H1 на странице категории (/programs/category/...). Если не заполнено, используется поле «Название».',
      },
    },
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
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Показывать на странице программ',
      defaultValue: true,
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
