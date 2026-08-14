import type { Block } from 'payload'

export const HeroMarqueeBlock: Block = {
  slug: 'heroMarquee',
  interfaceName: 'HeroMarqueeBlock',
  labels: {
    singular: 'Первый экран с галереей',
    plural: 'Первый экран с галереей',
  },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      label: 'Тег над заголовком',
      admin: {
        description: 'Короткая фраза-бейдж над заголовком. Необязательно.',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      required: true,
      defaultValue: 'Школа, где детям интересно учиться',
    },
    {
      name: 'titleEmphasis',
      type: 'text',
      label: 'Слово с подчёркиванием',
      admin: {
        description:
          'Точное слово или фраза из заголовка, которую нужно выделить анимированным подчёркиванием. Необязательно.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      admin: {
        description: 'Краткий текст под заголовком.',
      },
    },
    {
      name: 'primaryButtonLabel',
      type: 'text',
      label: 'Текст кнопки',
    },
    {
      name: 'primaryButtonLink',
      type: 'text',
      label: 'Ссылка кнопки',
      admin: {
        description: 'Адрес для кнопки. Показывается только если заполнены оба поля.',
        condition: (_, siblingData) => Boolean(siblingData?.primaryButtonLabel),
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
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Изображения',
      admin: {
        description:
          'Изображения для бегущей строки внизу экрана. Обычно берутся из галереи «Новой школы».',
      },
    },
  ],
}
