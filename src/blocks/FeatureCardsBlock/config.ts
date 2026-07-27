import type { Block } from 'payload'

export const FeatureCardsBlock: Block = {
  slug: 'featureCards',
  interfaceName: 'FeatureCardsBlock',
  labels: {
    singular: 'Преимущества',
    plural: 'Преимущества',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      required: true,
      defaultValue: 'Почему мы?',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      admin: {
        description: 'Краткий текст перед пунктами.',
      },
    },
    {
      name: 'hideTitle',
      type: 'checkbox',
      label: 'Скрыть заголовок',
      admin: {
        description: 'Если отмечено, заголовок не будет отображаться.',
      },
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Пункты',
      minRows: 1,
      labels: {
        singular: 'Пункт',
        plural: 'Пункты',
      },
      admin: {
        description: 'Добавьте столько пунктов, сколько нужно.',
        initCollapsed: true,
      },
      defaultValue: [
        {
          text: 'Опытные учителя с профильным образованием',
          iconName: 'graduation-cap',
        },
        {
          text: 'Все предметы по ФГОС. Высокий уровень знаний',
          iconName: 'book-open',
        },
        {
          text: 'Индивидуальный подход к способностям каждого ребенка',
          iconName: 'users',
        },
        {
          text: 'Дополнительный английский и шахматы в расписании',
          iconName: 'calendar-days',
        },
        {
          text: 'Работа в элементах лучших финских образовательных технологий',
          iconName: 'lightbulb',
        },
        {
          text: 'Коммуникативная методика при изучении английского языка',
          iconName: 'heart-handshake',
        },
      ],
      fields: [
        {
          name: 'text',
          type: 'textarea',
          label: 'Заголовок',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Изображение',
          admin: {
            description: 'Иллюстрация для пункта.',
          },
        },
        {
          name: 'iconName',
          type: 'text',
          label: 'Иконка',
          admin: {
            description: 'Например: book-open.',
          },
        },
      ],
    },
  ],
}
