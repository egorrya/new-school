import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { publicReadBooleanField } from '../../access/publicRead'
import { nestedTabBlocks } from '@/blocks/TabsBlock/config'
import { defaultLexical } from '@/fields/defaultLexical'

import { clubInfoCardIconOptions } from './clubInfoCardIcons'

export const Clubs: CollectionConfig<'clubs'> = {
  slug: 'clubs',
  labels: {
    singular: 'Программа',
    plural: 'Программы',
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
    category: true,
    shortDescription: true,
    previewImage: true,
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
      name: 'category',
      type: 'relationship',
      relationTo: 'programCategories',
      label: 'Категория',
      admin: {
        description: 'Категория программы.',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Краткое описание',
      admin: {
        description: 'Короткий анонс для карточек и списков.',
      },
    },
    {
      name: 'previewImage',
      type: 'upload',
      label: 'Картинка для превью',
      relationTo: 'media',
      admin: {
        description:
          'Используется в карточках на странице списка программ. Если не указано, используется обложка.',
      },
    },
    {
      name: 'infoCards',
      type: 'array',
      label: 'Мини-карточки',
      labels: {
        singular: 'Мини-карточка',
        plural: 'Мини-карточки',
      },
      admin: {
        description:
          'Короткие карточки под описанием программы: например возраст, формат занятий, расписание.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          label: 'Описание',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          label: 'Иконка',
          required: true,
          options: clubInfoCardIconOptions,
        },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      label: 'Обложка',
      relationTo: 'media',
      admin: {
        description: 'Крупное изображение на странице программы, под мини-карточками.',
      },
    },
    {
      name: 'coverImagePosition',
      type: 'select',
      label: 'Выравнивание обложки',
      defaultValue: 'center',
      options: [
        { label: 'К верху', value: 'top' },
        { label: 'К середине', value: 'center' },
        { label: 'К низу', value: 'bottom' },
      ],
      admin: {
        description:
          'Широкая обложка обрезается по высоте — выберите, какую часть изображения показывать.',
        condition: (_data, siblingData) => Boolean(siblingData?.coverImage),
      },
    },
    {
      name: 'tabs',
      type: 'array',
      label: 'Вкладки',
      labels: {
        singular: 'Вкладка',
        plural: 'Вкладки',
      },
      admin: {
        description:
          'Содержимое страницы программы: заголовок выводится по центру, а вкладки — под ним. В каждой вкладке можно добавить текст и вложенные screens (расписание, программа занятий, FAQ и т.д.).',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Название вкладки',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Текст',
          editor: defaultLexical,
        },
        {
          name: 'layout',
          type: 'blocks',
          label: 'Screens во вкладке',
          admin: {
            description: 'Можно добавлять любые screens, кроме блока вкладок.',
            initCollapsed: true,
          },
          blocks: nestedTabBlocks,
        },
      ],
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
