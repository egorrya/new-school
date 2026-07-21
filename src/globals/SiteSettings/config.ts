import type { GlobalConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Настройки сайта',
  admin: {
    group: 'Настройки',
  },
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      label: 'Название сайта',
      required: true,
      admin: {
        description: 'Используется в шапке, подвале и базовых метаданных.',
      },
    },
    {
      name: 'logoType',
      type: 'select',
      label: 'Вид логотипа',
      defaultValue: 'text',
      options: [
        {
          label: 'Текст',
          value: 'text',
        },
        {
          label: 'Изображение',
          value: 'image',
        },
      ],
      admin: {
        description: 'Текстовый логотип показывает название сайта в одну строку.',
      },
    },
    {
      name: 'logoImage',
      type: 'upload',
      label: 'Логотип',
      relationTo: 'media',
      admin: {
        condition: (_, data) => data?.logoType === 'image',
        description: 'Загрузите файл в медиа или выберите существующий медиафайл для логотипа.',
        components: {
          Field: '@/components/admin/LogoUploadField',
        },
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Телефон',
      admin: {
        description: 'Основной номер для связи.',
      },
    },
    {
      name: 'email',
      type: 'email',
      label: 'Электронная почта',
      admin: {
        description: 'Основной адрес электронной почты.',
      },
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Адрес',
      admin: {
        description: 'Физический адрес школы.',
      },
    },
    {
      name: 'vkUrl',
      type: 'text',
      label: 'Ссылка VK',
      admin: {
        description: 'Ссылка на сообщество VK.',
      },
    },
    {
      name: 'maxUrl',
      type: 'text',
      label: 'Ссылка MAX',
      admin: {
        description: 'Ссылка на официальный канал в MAX.',
      },
    },
    {
      name: 'telegramUrl',
      type: 'text',
      label: 'Ссылка Telegram',
      admin: {
        description: 'Ссылка на Telegram-канал.',
      },
    },
    {
      name: 'whatsappUrl',
      type: 'text',
      label: 'Ссылка WhatsApp',
      admin: {
        description: 'Ссылка на WhatsApp.',
      },
    },
    {
      name: 'defaultApplicationCtaText',
      type: 'text',
      label: 'Текст кнопки заявки по умолчанию',
      admin: {
        description: 'Показывается на кнопке заявки, если для страницы не задан свой текст.',
      },
    },
  ],
}
