import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { authenticated } from '../../access/authenticated'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Шапка',
  admin: {
    group: 'Настройки',
  },
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'navigationLinks',
      type: 'array',
      label: 'Ссылки в шапке',
      maxRows: 8,
      fields: [
        link({
          appearances: false,
        }),
      ],
      admin: {
        initCollapsed: true,
        description: 'Ссылки для верхнего меню сайта.',
      },
    },
  ],
}
