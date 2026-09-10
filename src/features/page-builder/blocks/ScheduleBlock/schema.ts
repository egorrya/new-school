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
      name: 'hideHeader',
      type: 'checkbox',
      label: 'Скрыть заголовок и текст',
      defaultValue: false,
      admin: {
        description: 'Показать только расписание, без заголовка и текста над ним.',
      },
    },
    {
      name: 'hideTitle',
      type: 'checkbox',
      label: 'Скрыть только заголовок',
      defaultValue: false,
      admin: {
        condition: (_data, siblingData) => !siblingData?.hideHeader,
        description:
          'Показать описание без заголовка — например, если это расписание единственное во вкладке и заголовок вкладки уже всё говорит.',
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
          name: 'club',
          type: 'relationship',
          relationTo: 'clubs',
          label: 'Кружок (необязательно)',
          admin: {
            description: 'Если выбрано — картинка, название и ссылка подставятся из карточки кружка.',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Подпись',
          admin: {
            condition: (_data, siblingData) => !siblingData?.club,
            description: 'Показывается, если кружок не выбран.',
          },
          validate: (value: string | null | undefined, { siblingData }: { siblingData?: { club?: unknown } }) => {
            if (!siblingData?.club && !value) {
              return 'Укажите подпись или выберите кружок.'
            }

            return true
          },
        },
        {
          name: 'value',
          type: 'text',
          label: 'Значение / время',
          required: true,
          admin: {
            description: 'Например: Пн-Пт, 09:00-18:00 — или время занятия, если выбран кружок.',
          },
        },
      ],
    },
    {
      name: 'viewAllLink',
      type: 'text',
      label: 'Ссылка на общее расписание (необязательно)',
      admin: {
        description: 'Например, /programs/raspisanie-kruzhkov — под таблицей появится ссылка на страницу.',
      },
    },
    {
      name: 'viewAllLabel',
      type: 'text',
      label: 'Текст ссылки',
      defaultValue: 'Посмотреть расписание всех кружков',
      admin: {
        condition: (_data, siblingData) => Boolean(siblingData?.viewAllLink),
      },
    },
  ],
}
