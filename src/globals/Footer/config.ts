import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { authenticated } from '../../access/authenticated'
import { defaultLegalEntityText } from './defaults'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Подвал',
  admin: {
    group: 'Настройки',
  },
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateFooter],
  },
  fields: [
    {
      name: 'footerNavigation',
      type: 'array',
      label: 'Ссылки в подвале',
      maxRows: 8,
      fields: [
        link({
          appearances: false,
        }),
      ],
      admin: {
        initCollapsed: true,
        description: 'Основные ссылки в нижней части сайта.',
      },
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Юридические страницы',
      maxRows: 6,
      fields: [
        link({
          appearances: false,
        }),
      ],
      admin: {
        initCollapsed: true,
        description: 'Ссылки на документы и правовую информацию.',
      },
    },
    {
      name: 'copyrightText',
      type: 'text',
      label: 'Текст копирайта',
      admin: {
        description: 'Например: © 2026 Новая школа',
      },
    },
    {
      name: 'legalEntityText',
      type: 'textarea',
      label: 'Юридическая информация',
      defaultValue: defaultLegalEntityText,
      admin: {
        description: 'Реквизиты и лицензия, отображаются в третьей колонке подвала.',
      },
    },
  ],
}
