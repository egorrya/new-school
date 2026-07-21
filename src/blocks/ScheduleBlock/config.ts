import type { Block } from 'payload'

export const ScheduleBlock: Block = {
  slug: 'schedule',
  interfaceName: 'ScheduleBlock',
  labels: {
    singular: 'Расписание',
    plural: 'Расписание',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      admin: {
        description: 'Краткий текст перед расписанием.',
      },
    },
    {
      name: 'scheduleItems',
      type: 'array',
      label: 'Строки расписания',
      minRows: 1,
      labels: {
        singular: 'Строка',
        plural: 'Строки',
      },
      admin: {
        description: 'Добавьте строки с расписанием.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Подпись',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          label: 'Значение',
          required: true,
          admin: {
            description: 'Например: Пн-Пт, 09:00-18:00.',
          },
        },
      ],
    },
  ],
}
