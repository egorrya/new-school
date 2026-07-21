import type { Block } from 'payload'

export const CTAFormBlock: Block = {
  slug: 'ctaForm',
  interfaceName: 'CTAFormBlock',
  labels: {
    singular: 'Форма заявки',
    plural: 'Форма заявки',
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
        description: 'Краткий текст перед формой.',
      },
    },
    {
      name: 'buttonLabel',
      type: 'text',
      label: 'Текст кнопки',
      required: true,
      admin: {
        description: 'Например: Оставить заявку.',
      },
    },
    {
      name: 'formType',
      type: 'select',
      label: 'Тип обращения',
      required: true,
      defaultValue: 'application',
      options: [
        {
          label: 'Заявка',
          value: 'application',
        },
        {
          label: 'Обратный звонок',
          value: 'callback',
        },
        {
          label: 'Кружок',
          value: 'club',
        },
      ],
      admin: {
        description: 'Выберите, какое обращение будет отправлять этот блок.',
      },
    },
  ],
}
