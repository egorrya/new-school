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
      name: 'avatarPreset',
      type: 'select',
      label: 'Предустановленный аватар',
      options: [
        {
          label: 'Мужчина 1',
          value: 'men/micah-1784914786335.svg',
        },
        {
          label: 'Мужчина 2',
          value: 'men/micah-1784914798547.svg',
        },
        {
          label: 'Мужчина 3',
          value: 'men/micah-1784914808913.svg',
        },
        {
          label: 'Мужчина 4',
          value: 'men/micah-1784914814162.svg',
        },
        {
          label: 'Мужчина 5',
          value: 'men/micah-1784914843905.svg',
        },
        {
          label: 'Женщина 1',
          value: 'women/micah-1784914470498.svg',
        },
        {
          label: 'Женщина 2',
          value: 'women/micah-1784914502367.svg',
        },
        {
          label: 'Женщина 3',
          value: 'women/micah-1784914592082.svg',
        },
        {
          label: 'Женщина 4',
          value: 'women/micah-1784914647503.svg',
        },
        {
          label: 'Женщина 5',
          value: 'women/micah-1784914705338.svg',
        },
      ],
      admin: {
        description: 'Выберите предустановленный аватар. Если не выбрано, будет использовано загруженное фото.',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Фото автора',
      admin: {
        description: 'Опциональное фото для компонента testimonials. Используется если не выбран предустановленный аватар.',
      },
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Текст отзыва',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      label: 'Описание (отображается под отзывом)',
      admin: {
        description: 'Опциональное описание, которое будет показано под отзывом. Если пусто, блок не будет отображаться.',
      },
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
