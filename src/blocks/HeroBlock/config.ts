import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: {
    singular: 'Первый экран',
    plural: 'Первый экран',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      required: true,
      defaultValue: 'Школа, где детям интересно учиться',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      defaultValue:
        'Помогаем детям учиться, раскрывать способности и находить свои сильные стороны через занятия, проекты и живое общение',
      admin: {
        description: 'Краткий текст под заголовком.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Фон blob',
      admin: {
        description:
          'Фоновое изображение первого экрана. По умолчанию используется /hero/blob.webp из public.',
      },
    },
    {
      name: 'showBlobBackground',
      type: 'checkbox',
      label: 'Показывать blob-фон',
      defaultValue: true,
      admin: {
        description: 'Выключите, чтобы скрыть фоновой blob-слой первого экрана.',
      },
    },
    {
      name: 'customBlobPositioning',
      type: 'checkbox',
      label: 'Кастомное позиционирование blob',
      defaultValue: true,
      admin: {
        condition: (_, siblingData) => siblingData?.showBlobBackground !== false,
        description: 'Выключите, чтобы blob использовал стандартную посадку без смещений и сжатия.',
      },
    },
    {
      name: 'kidsImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Изображение поверх',
      admin: {
        description:
          'Верхнее изображение первого экрана. По умолчанию используется /media/kids.webp.',
      },
    },
    {
      name: 'showLatestNews',
      type: 'checkbox',
      label: 'Показывать последнюю новость',
      defaultValue: false,
      admin: {
        description: 'Выключите, чтобы скрыть карточку последней новости на первом экране.',
      },
    },
    {
      name: 'primaryButtonLabel',
      type: 'text',
      label: 'Текст первой кнопки',
      required: true,
      defaultValue: 'Оставить заявку',
    },
    {
      name: 'primaryButtonLink',
      type: 'text',
      label: 'Ссылка первой кнопки',
      required: true,
      admin: {
        description: 'Адрес для первой кнопки.',
      },
    },
    {
      name: 'secondaryButtonLabel',
      type: 'text',
      label: 'Текст второй кнопки',
      admin: {
        description: 'Необязательно. Показывается только если заполнены оба поля.',
      },
    },
    {
      name: 'secondaryButtonLink',
      type: 'text',
      label: 'Ссылка второй кнопки',
      admin: {
        description: 'Адрес для второй кнопки.',
        condition: (_, siblingData) => Boolean(siblingData?.secondaryButtonLabel),
      },
    },
  ],
}
