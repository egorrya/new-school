import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { FORM_SUBMISSION_TYPES, buildCTAFormSubmissionKey } from '@/server/forms/ctaForm'
import { notifyFormSubmission } from '@/server/forms/notifications'
import { isRussianPhone } from '@/shared/lib/russianPhone'

const formTypeOptions = FORM_SUBMISSION_TYPES.map((value) => ({
  label:
    value === 'application'
      ? 'Заявка'
      : value === 'callback'
        ? 'Обратный звонок'
        : value === 'club'
          ? 'Программа'
          : 'Отклик на вакансию',
  value,
}))

function isVacancySubmission(_: unknown, siblingData: { formType?: string } | undefined) {
  return siblingData?.formType === 'vacancy'
}

export const FormSubmissions: CollectionConfig<'form-submissions'> = {
  slug: 'form-submissions',
  labels: {
    singular: 'Заявка',
    plural: 'Заявки',
  },
  access: {
    admin: authenticated,
    create: () => true,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    group: 'Обращения',
    defaultColumns: ['name', 'phone', 'formType', 'consentAccepted', 'createdAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'ФИО / имя',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Телефон',
      required: true,
      validate: (value: unknown) =>
        typeof value === 'string' && isRussianPhone(value)
          ? true
          : 'Введите номер в формате +7 (999) 123-45-67.',
    },
    {
      name: 'pageUrl',
      type: 'text',
      label: 'Страница',
      required: true,
      admin: {
        description: 'Адрес страницы, с которой пришла заявка.',
      },
    },
    {
      name: 'formType',
      type: 'select',
      label: 'Тип формы',
      required: true,
      options: formTypeOptions,
    },
    {
      name: 'job',
      type: 'relationship',
      relationTo: 'jobs',
      label: 'Вакансия',
      admin: {
        condition: isVacancySubmission,
        description: 'Заполняется только при отклике на вакансию.',
      },
    },
    {
      name: 'club',
      type: 'relationship',
      relationTo: 'clubs',
      label: 'Программа',
      admin: {
        condition: (_, siblingData: { formType?: string } | undefined) => siblingData?.formType === 'club',
        description: 'Заполняется только для заявки из страницы программы.',
      },
    },
    {
      name: 'age',
      type: 'number',
      label: 'Возраст',
      admin: {
        condition: isVacancySubmission,
        description: 'Заполняется в анкете соискателя.',
      },
    },
    {
      name: 'city',
      type: 'text',
      label: 'Город проживания',
      admin: {
        condition: isVacancySubmission,
      },
    },
    {
      name: 'email',
      type: 'email',
      label: 'Адрес электронной почты',
      admin: {
        condition: isVacancySubmission,
      },
    },
    {
      name: 'education',
      type: 'select',
      label: 'Образование',
      options: [
        {
          label: 'Высшее',
          value: 'higher',
        },
        {
          label: 'Среднее специальное',
          value: 'vocational',
        },
      ],
      admin: {
        condition: isVacancySubmission,
      },
    },
    {
      name: 'educationalInstitution',
      type: 'textarea',
      label: 'Учебное заведение и год окончания',
      admin: {
        condition: isVacancySubmission,
        description: 'Укажите название учебного заведения и год окончания, если есть образование.',
      },
    },
    {
      name: 'specialty',
      type: 'text',
      label: 'Специальность по диплому',
      admin: {
        condition: isVacancySubmission,
      },
    },
    {
      name: 'workExperience',
      type: 'textarea',
      label: 'Стаж работы по специальности',
      admin: {
        condition: isVacancySubmission,
      },
    },
    {
      name: 'about',
      type: 'textarea',
      label: 'Дополнительная информация о соискателе',
      admin: {
        condition: isVacancySubmission,
      },
    },
    {
      name: 'submissionKey',
      type: 'text',
      label: 'Ключ заявки',
      unique: true,
      index: true,
      required: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'consentAccepted',
      type: 'checkbox',
      label: 'Согласие на обработку данных',
      required: true,
      defaultValue: false,
      admin: {
        description: 'Заявка должна содержать подтверждение согласия пользователя.',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          await notifyFormSubmission({ payload: req.payload, submission: doc })
        }
      },
    ],
    beforeValidate: [
      ({ data }) => {
        if (!data) {
          return data
        }

        const formType = typeof data.formType === 'string' ? data.formType : 'application'
        const pageUrl = typeof data.pageUrl === 'string' ? data.pageUrl : ''
        const phone = typeof data.phone === 'string' ? data.phone : ''
        const clubValue = Array.isArray(data.club) ? data.club[0] : data.club
        const clubId =
          typeof clubValue === 'number'
            ? clubValue
            : typeof clubValue === 'object' && clubValue && 'id' in clubValue && typeof clubValue.id === 'number'
              ? clubValue.id
              : null

        if (!pageUrl || !phone) {
          return data
        }

        return {
          ...data,
          submissionKey: buildCTAFormSubmissionKey({
            clubId,
            formType:
              formType === 'application' || formType === 'callback' || formType === 'club' || formType === 'vacancy'
                ? formType
                : 'application',
            pageUrl,
            phone,
          }),
        }
      },
    ],
  },
}
