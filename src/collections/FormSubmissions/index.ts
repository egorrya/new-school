import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { CTA_FORM_TYPES, buildCTAFormSubmissionKey } from '@/utilities/ctaForm'

const formTypeOptions = CTA_FORM_TYPES.map((value) => ({
  label: value === 'application' ? 'Заявка' : value === 'callback' ? 'Обратный звонок' : 'Программа',
  value,
}))

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
    defaultColumns: ['name', 'job', 'phone', 'formType', 'consentAccepted', 'createdAt'],
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
        description: 'Заполняется при отклике на конкретную вакансию.',
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
        description: 'Заполняется в анкете соискателя.',
      },
    },
    {
      name: 'city',
      type: 'text',
      label: 'Город проживания',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Адрес электронной почты',
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
    },
    {
      name: 'educationalInstitution',
      type: 'textarea',
      label: 'Учебное заведение и год окончания',
      admin: {
        description: 'Укажите название учебного заведения и год окончания, если есть образование.',
      },
    },
    {
      name: 'specialty',
      type: 'text',
      label: 'Специальность по диплому',
    },
    {
      name: 'workExperience',
      type: 'textarea',
      label: 'Стаж работы по специальности',
    },
    {
      name: 'about',
      type: 'textarea',
      label: 'Дополнительная информация о соискателе',
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
              formType === 'application' || formType === 'callback' || formType === 'club'
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
