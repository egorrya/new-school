import type { Block } from 'payload'

export const TeacherListBlock: Block = {
  slug: 'teacherList',
  interfaceName: 'TeacherListBlock',
  labels: {
    singular: 'Список преподавателей',
    plural: 'Списки преподавателей',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      defaultValue: 'Наши преподаватели',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      admin: {
        description: 'Короткий текст перед списком.',
      },
    },
    {
      name: 'selectedTeachers',
      type: 'relationship',
      label: 'Выбранные преподаватели',
      relationTo: 'teachers',
      hasMany: true,
      admin: {
        description: 'Оставьте пустым, чтобы показать преподавателей автоматически по порядку.',
      },
    },
    {
      name: 'itemLimit',
      type: 'number',
      label: 'Количество преподавателей',
      defaultValue: 6,
      min: 1,
      admin: {
        description: 'Используется, если конкретные преподаватели не выбраны.',
      },
    },
  ],
}
