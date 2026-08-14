import configPromise from '@payload-config'
import { randomUUID } from 'node:crypto'
import { getPayload } from 'payload'
import { z } from 'zod'

import type { Job } from '@/payload-types'
import { type CTAFormAction, type CTAFormState } from '@/components/blocks/cta-form.types'
import { buildCTAFormSubmissionKey, normalizePhone } from '@/utilities/ctaForm'

import { VacancyApplicationSectionClient } from './VacancyApplicationSection.client'

type Props = {
  jobs: Pick<Job, 'id' | 'title'>[]
  selectedJob?: Pick<Job, 'id' | 'title'> | null
}

const optionalText = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().trim().max(1000, 'Текст слишком длинный.').optional(),
)

const vacancyApplicationSchema = z.object({
  about: z.string().trim().min(2, 'Расскажите немного о себе.').max(2000, 'Текст слишком длинный.'),
  age: z.coerce
    .number({ error: 'Укажите возраст.' })
    .int('Укажите возраст целым числом.')
    .min(14, 'Укажите корректный возраст.')
    .max(100, 'Укажите корректный возраст.'),
  city: z.string().trim().min(2, 'Укажите город проживания.').max(120, 'Название города слишком длинное.'),
  consentAccepted: z.boolean(),
  education: z.enum(['higher', 'vocational'], {
    error: 'Выберите уровень образования.',
  }),
  educationalInstitution: optionalText,
  email: z.string().trim().email('Введите корректный адрес электронной почты.'),
  jobId: z.preprocess(
    (value) => (value === null || value === '' ? undefined : value),
    z.coerce.number().int().positive().optional(),
  ),
  name: z.string().trim().min(2, 'Укажите ФИО.').max(160, 'ФИО слишком длинное.'),
  phone: z
    .string()
    .trim()
    .min(6, 'Введите корректный номер телефона.')
    .refine((value) => normalizePhone(value).length >= 10, 'Введите корректный номер телефона.'),
  specialty: z.string().trim().min(2, 'Укажите специальность по диплому.').max(240, 'Текст слишком длинный.'),
  workExperience: z
    .string()
    .trim()
    .min(1, 'Укажите стаж работы по специальности.')
    .max(500, 'Текст слишком длинный.'),
})

function isDuplicateSubmissionError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }

  const maybeError = error as {
    code?: string
    cause?: { code?: string }
    message?: string
  }

  return (
    maybeError.code === '23505' ||
    maybeError.cause?.code === '23505' ||
    Boolean(maybeError.message?.includes('duplicate key value'))
  )
}

export function VacancyApplicationSection({ jobs, selectedJob = null }: Props) {
  const activeJobIds = jobs.map((job) => job.id)

  async function submitVacancyApplication(
    _previousState: CTAFormState,
    formData: FormData,
  ): Promise<CTAFormState> {
    'use server'

    try {
      const parsed = vacancyApplicationSchema.safeParse({
        about: formData.get('about'),
        age: formData.get('age'),
        city: formData.get('city'),
        consentAccepted: formData.get('consentAccepted') === 'on',
        education: formData.get('education'),
        educationalInstitution: formData.get('educationalInstitution'),
        email: formData.get('email'),
        jobId: formData.get('jobId'),
        name: formData.get('name'),
        phone: formData.get('phone'),
        specialty: formData.get('specialty'),
        workExperience: formData.get('workExperience'),
      })

      if (!parsed.success) {
        return {
          eventId: randomUUID(),
          message: parsed.error.issues[0]?.message || 'Проверьте заполнение анкеты.',
          status: 'error',
        }
      }

      const application = parsed.data

      if (!application.consentAccepted) {
        return {
          eventId: randomUUID(),
          message: 'Подтвердите согласие на обработку персональных данных.',
          status: 'error',
        }
      }

      if (application.jobId && !activeJobIds.includes(application.jobId)) {
        return {
          eventId: randomUUID(),
          message: 'Эта вакансия больше не доступна. Заполните анкету без выбора вакансии.',
          status: 'error',
        }
      }

      const pageUrl = application.jobId ? `/vacancies/${application.jobId}` : '/vacancies'
      const submissionKey = buildCTAFormSubmissionKey({
        formType: 'application',
        pageUrl,
        phone: application.phone,
      })
      const payload = await getPayload({ config: configPromise })

      const duplicate = await payload.find({
        collection: 'form-submissions',
        limit: 1,
        overrideAccess: true,
        pagination: false,
        where: {
          submissionKey: {
            equals: submissionKey,
          },
        },
      })

      if (duplicate.docs.length > 0) {
        return {
          eventId: randomUUID(),
          message: 'Такая анкета уже отправлена. Попробуйте изменить номер телефона.',
          status: 'error',
        }
      }

      await payload.create({
        collection: 'form-submissions',
        data: {
          about: application.about,
          age: application.age,
          city: application.city,
          consentAccepted: application.consentAccepted,
          education: application.education,
          educationalInstitution: application.educationalInstitution,
          email: application.email,
          formType: 'application',
          job: application.jobId,
          name: application.name,
          pageUrl,
          phone: application.phone,
          specialty: application.specialty,
          submissionKey,
          workExperience: application.workExperience,
        },
        overrideAccess: true,
      })

      return {
        eventId: randomUUID(),
        message: 'Мы обязательно свяжемся с вами в ближайшее время.',
        status: 'success',
      }
    } catch (error) {
      if (isDuplicateSubmissionError(error)) {
        return {
          eventId: randomUUID(),
          message: 'Такая анкета уже отправлена. Попробуйте изменить номер телефона.',
          status: 'error',
        }
      }

      return {
        eventId: randomUUID(),
        message: 'Не удалось отправить анкету. Попробуйте ещё раз позже.',
        status: 'error',
      }
    }
  }

  return (
    <VacancyApplicationSectionClient
      action={submitVacancyApplication as CTAFormAction}
      selectedJob={selectedJob}
    />
  )
}
