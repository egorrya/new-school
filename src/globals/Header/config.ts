import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { authenticated } from '../../access/authenticated'
import { revalidateHeader } from './hooks/revalidateHeader'

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
  hooks: {
    afterChange: [revalidateHeader],
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
        {
          name: 'subLinks',
          type: 'array',
          label: 'Подпункты меню',
          maxRows: 12,
          fields: [
            link({
              appearances: false,
            }),
          ],
          admin: {
            initCollapsed: true,
            description:
              'Если добавлены подпункты, при клике на этот пункт меню будет открываться список подпунктов вместо перехода по ссылке.',
          },
        },
      ],
      admin: {
        initCollapsed: true,
        description: 'Ссылки для верхнего меню сайта.',
      },
    },
    {
      name: 'showSecondaryHeader',
      type: 'checkbox',
      label: 'Показать верхнюю строку (второй хедер)',
      defaultValue: true,
      admin: {
        description: 'Включить или отключить отображение дополнительной строки ссылок над основной шапкой.',
      },
    },
    {
      name: 'secondaryHeaderLinks',
      type: 'array',
      label: 'Ссылки в верхней строке (второй хедер)',
      maxRows: 6,
      fields: [
        link({
          appearances: false,
        }),
      ],
      admin: {
        initCollapsed: true,
        description:
          'Дополнительная строка ссылок над основной шапкой. Не закреплена при прокрутке — исчезает вместе со страницей, когда посетитель прокручивает вниз.',
      },
    },
  ],
}
