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
      label: 'Большой логотип',
      relationTo: 'media',
      admin: {
        condition: (_, data) => data?.logoType === 'image',
        description: 'Показывается при загрузке страницы и используется в подвале.',
        components: {
          Field: '@/components/admin/LogoUploadField',
        },
      },
    },
    {
      name: 'logoImageCompact',
      type: 'upload',
      label: 'Маленький логотип',
      relationTo: 'media',
      admin: {
        condition: (_, data) => data?.logoType === 'image',
        description: 'Показывается в шапке после скролла. Если не задан, будет использоваться большой логотип.',
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
    {
      name: 'contactsSection',
      type: 'group',
      label: 'Контакты и карта перед подвалом',
      admin: {
        description:
          'Блок с контактами, формой заявки и картой, который автоматически показывается внизу каждой страницы сайта перед подвалом.',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Показывать блок на всех страницах',
          defaultValue: true,
        },
        {
          name: 'mapEmbedUrl',
          type: 'text',
          label: 'Ссылка на карту (iframe)',
          defaultValue:
            'https://yandex.ru/map-widget/v1/?um=constructor%3Aa21aa33533bf1ac31fee26d61f75c2fcf44a922c63cbd5b4af848ae5f24ab52a&source=constructor',
          admin: {
            condition: (_, data) => data?.contactsSection?.enabled !== false,
            description:
              'Ссылка для встраивания карты (например, код конструктора карт Яндекс.Карт). Оставьте поле пустым, чтобы скрыть карту, но показывать контакты и форму.',
          },
        },
      ],
    },
  ],
}
