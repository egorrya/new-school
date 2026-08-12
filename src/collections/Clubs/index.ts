import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { publicReadBooleanField } from '../../access/publicRead'
import { nestedTabBlocks } from '@/blocks/TabsBlock/config'
import { defaultLexical } from '@/fields/defaultLexical'

import { clubInfoCardIconOptions } from './clubInfoCardIcons'
import { weekdayOptions } from './scheduleDays'

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
    linkToCategory: true,
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
      name: 'useTabsNavigation',
      type: 'checkbox',
      label: 'Показывать переключатель вкладок вместо мини-карточек',
      defaultValue: false,
      admin: {
        description:
          'Вместо сетки мини-карточек под описанием — закреплённый переключатель вкладок сверху. Подходит, например, для страницы-расписания с вкладками по дням недели.',
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
          name: 'icon',
          type: 'select',
          label: 'Иконка',
          options: clubInfoCardIconOptions,
          admin: {
            description: 'Иконка для мини-карточки перехода к этому разделу под описанием программы.',
          },
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
      name: 'scheduleDays',
      type: 'select',
      hasMany: true,
      label: 'Дни занятий',
      options: weekdayOptions,
      admin: {
        position: 'sidebar',
        description:
          'Дни недели, в которые проходят занятия. Кружок автоматически появится в соответствующий день на странице «Расписание».',
      },
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
    {
      name: 'linkToCategory',
      type: 'relationship',
      relationTo: 'programCategories',
      label: 'Карточка-ссылка на категорию',
      admin: {
        position: 'sidebar',
        description:
          'Если выбрано, карточка программы и переход по прямой ссылке будут вести на страницу этой категории, а не на страницу программы. Собственное содержание программы (вкладки) при этом не нужно — карточка работает как ссылка.',
      },
    },
  ],
}
