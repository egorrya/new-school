import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { publicReadBooleanField } from '../../access/publicRead'
import { defaultLexical } from '@/fields/defaultLexical'

export const Jobs: CollectionConfig<'jobs'> = {
  slug: 'jobs',
  labels: {
    singular: 'Вакансия',
    plural: 'Вакансии',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: publicReadBooleanField('isActive'),
    update: authenticated,
  },
  admin: {
    group: 'Контент',
    defaultColumns: ['title', 'isActive', 'updatedAt'],
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
      name: 'shortDescription',
      type: 'textarea',
      label: 'Краткое описание',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Описание',
      editor: defaultLexical,
      admin: {
        description:
          'Полный текст вакансии. Показывается на отдельной странице вакансии на сайте.',
        condition: (_data, siblingData) => !siblingData?.externalUrl,
      },
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'Внешняя ссылка',
      admin: {
        description:
          'Если заполнено, карточка вакансии будет вести на этот адрес вместо страницы вакансии на сайте (описание выше при этом скрывается).',
      },
    },
    {
      name: 'contactText',
      type: 'textarea',
      label: 'Контактный текст',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Показывать на сайте',
      defaultValue: false,
    },
  ],
}
