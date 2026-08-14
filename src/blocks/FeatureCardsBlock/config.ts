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
          text: 'Просторные современные классы',
          iconName: 'building-2',
        },
        {
          text: 'Профессиональные педагоги по всем предметам',
          iconName: 'graduation-cap',
        },
        {
          text: 'Английский язык с преподавателями Школы английского языка SkillSet',
          iconName: 'languages',
        },
        {
          text: 'Спортивный зал',
          iconName: 'dumbbell',
        },
        {
          text: 'Компьютерный класс',
          iconName: 'monitor',
        },
        {
          text: 'Лаборатория',
          iconName: 'flask-conical',
        },
        {
          text: 'ИЗО-студия и зал для музыкальных занятий',
          iconName: 'palette',
        },
        {
          text: 'Уютная столовая',
          iconName: 'utensils-crossed',
        },
        {
          text: 'Пространства для активных игр и отдыха',
          iconName: 'volleyball',
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
