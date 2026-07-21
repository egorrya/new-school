import configPromise from '@payload-config'
import { randomUUID } from 'node:crypto'
import { getPayload } from 'payload'
import { z } from 'zod'

import { PageBlockContainer, PageBlockSection } from '@/components/shared/PageBlock'
import { PageBlockHeader } from '@/components/shared/PageBlock'
import {
  CTA_FORM_TYPES,
  buildCTAFormSubmissionKey,
  normalizePhone,
  type CTAFormType,
} from '@/utilities/ctaForm'

import { CTAFormClient } from './CTAFormBlock.client'
import { type CTAFormAction, type CTAFormState } from './cta-form.types'

type Props = {
  clubId?: number | null
  buttonLabel: string
  description?: string | null
  formType: CTAFormType
  pageUrl: string
  title: string
}

const ctaFormSubmissionSchema = z.object({
  clubId: z.preprocess(
    (value) => (value === null || value === '' ? undefined : value),
    z.coerce.number().int().positive().optional(),
  ),
  consentAccepted: z.boolean(),
  formType: z.enum(CTA_FORM_TYPES),
  name: z.string().trim().min(2, 'Введите имя.').max(120, 'Имя слишком длинное.'),
  pageUrl: z.string().url('Укажите корректную страницу формы.'),
  phone: z
    .string()
    .trim()
    .min(6, 'Введите корректный номер телефона.')
    .refine((value) => normalizePhone(value).length >= 10, 'Введите корректный номер телефона.'),
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

export function CTAFormBlock({ clubId, title, description, buttonLabel, formType, pageUrl }: Props) {
  async function submitCTAForm(
    _previousState: CTAFormState,
    formData: FormData,
  ): Promise<CTAFormState> {
    'use server'

    try {
      const parsed = ctaFormSubmissionSchema.safeParse({
        clubId: formData.get('clubId'),
        consentAccepted: formData.get('consentAccepted') === 'on',
        formType: formData.get('formType'),
        name: formData.get('name'),
        pageUrl: formData.get('pageUrl'),
        phone: formData.get('phone'),
      })

      if (!parsed.success) {
        return {
          eventId: randomUUID(),
          message: parsed.error.issues[0]?.message || 'Проверьте заполнение формы.',
          status: 'error',
        }
      }

      const { clubId: submittedClubId, consentAccepted, formType: submittedFormType, name, pageUrl: submittedPageUrl, phone } =
        parsed.data

      if (!consentAccepted) {
        return {
          eventId: randomUUID(),
          message: 'Поставьте галочку согласия, чтобы отправить заявку.',
          status: 'error',
        }
      }

      if (submittedFormType === 'club' && !submittedClubId) {
        return {
          eventId: randomUUID(),
          message: 'Не удалось определить кружок для заявки.',
          status: 'error',
        }
      }

      const submissionKey = buildCTAFormSubmissionKey({
        clubId: submittedFormType === 'club' ? submittedClubId : null,
        formType: submittedFormType as CTAFormType,
        pageUrl: submittedPageUrl,
        phone,
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
          message: 'Такая заявка уже отправлена. Попробуйте изменить номер телефона или обратитесь в школу напрямую.',
          status: 'error',
        }
      }

      await payload.create({
        collection: 'form-submissions',
        data: {
          club: submittedFormType === 'club' ? submittedClubId : undefined,
          consentAccepted,
          formType: submittedFormType,
          name,
          pageUrl: submittedPageUrl,
          phone,
          submissionKey,
        },
        overrideAccess: true,
      })

      return {
        eventId: randomUUID(),
        message: 'Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.',
        status: 'success',
      }
    } catch (error) {
      if (isDuplicateSubmissionError(error)) {
        return {
          eventId: randomUUID(),
          message: 'Такая заявка уже отправлена. Попробуйте изменить номер телефона или обратитесь в школу напрямую.',
          status: 'error',
        }
      }

      return {
        eventId: randomUUID(),
        message: 'Не удалось отправить заявку. Попробуйте ещё раз позже.',
        status: 'error',
      }
    }
  }

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <div className="grid gap-0 overflow-hidden lg:grid-cols-[minmax(0,0.95fr)_minmax(20rem,1.05fr)]">
          <div className="border-b-2 border-border p-6 sm:p-8 lg:border-b-0 lg:border-r-2 lg:p-10">
            <PageBlockHeader
              description={description || 'Оставьте заявку, и мы свяжемся с вами.'}
              title={title}
              titleClassName="text-3xl sm:text-4xl lg:text-5xl"
            />
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <CTAFormClient
              action={submitCTAForm as CTAFormAction}
              buttonLabel={buttonLabel}
              clubId={clubId}
              formType={formType}
              pageUrl={pageUrl}
            />
          </div>
        </div>
      </PageBlockContainer>
    </PageBlockSection>
  )
}
