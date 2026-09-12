import configPromise from '@payload-config'
import { randomUUID } from 'node:crypto'
import { getPayload } from 'payload'
import { z } from 'zod'

import { PageBlockContainer, PageBlockSection } from '@/shared/components/PageBlock'
import { PageBlockHeader } from '@/shared/components/PageBlock'
import { MotionReveal } from '@/shared/components/MotionReveal'
import { SiteContacts, SiteSocialLinks } from '@/shared/layout/SiteContacts'
import { getGlobal } from '@/server/payload/getGlobals'
import { cn } from '@/shared/lib/cn'
import {
  CTA_FORM_TYPES,
  buildCTAFormSubmissionKey,
  isRussianPhone,
  normalizePhone,
  type CTAFormType,
} from '@/server/forms/ctaForm'
import { isSpamFormSubmission } from '@/server/forms/antiSpam'

import { CTAFormClient } from './Form.client'
import { type CTAFormAction, type CTAFormState } from './types'

type Props = {
  clubId?: number | null
  buttonLabel: string
  description?: string | null
  formType: CTAFormType
  insideTabs?: boolean
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
    .refine(isRussianPhone, 'Введите номер в формате +7 (999) 123-45-67.'),
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

export async function CTAFormBlock({
  clubId,
  title,
  description,
  buttonLabel,
  formType,
  insideTabs,
  pageUrl,
}: Props) {
  const siteSettings = clubId ? undefined : await getGlobal('site-settings', 1)

  async function submitCTAForm(
    _previousState: CTAFormState,
    formData: FormData,
  ): Promise<CTAFormState> {
    'use server'

    try {
      if (isSpamFormSubmission(formData)) {
        return {
          eventId: randomUUID(),
          message: 'Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.',
          status: 'success',
        }
      }

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

      const {
        clubId: submittedClubId,
        consentAccepted,
        formType: submittedFormType,
        name,
        pageUrl: submittedPageUrl,
        phone,
      } = parsed.data

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
          message:
            'Такая заявка уже отправлена. Попробуйте изменить номер телефона или обратитесь в школу напрямую.',
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
          message:
            'Такая заявка уже отправлена. Попробуйте изменить номер телефона или обратитесь в школу напрямую.',
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
      <PageBlockContainer container={!insideTabs}>
        <MotionReveal amount={0.1} duration={0.235} margin="-15% 0px -15% 0px" y={18}>
          <div className={cn('grid items-center gap-0 overflow-hidden', !clubId && 'lg:grid-cols-12')}>
            {!clubId ? (
              <div className="py-6 sm:p-8 lg:col-span-7 lg:p-10">
                <PageBlockHeader
                  description={description}
                  descriptionDelay={0.15}
                  title={insideTabs ? null : 'Есть вопросы? Мы рядом'}
                  titleClassName="text-2xl sm:text-3xl lg:text-4xl"
                />

                <div className="mt-8 space-y-8">
                  <SiteContacts siteSettings={siteSettings} variant="plain" />
                  <SiteSocialLinks siteSettings={siteSettings} variant="icon" />
                </div>
              </div>
            ) : null}

            <div className={cn('py-6 sm:p-8 lg:p-10', !clubId && 'lg:col-span-5')}>
              <CTAFormClient
                action={submitCTAForm as CTAFormAction}
                buttonLabel={buttonLabel}
                clubId={clubId}
                formType={formType}
                pageUrl={pageUrl}
                title={title}
              />
            </div>
          </div>
        </MotionReveal>
      </PageBlockContainer>
    </PageBlockSection>
  )
}
