import { createHash } from 'node:crypto'

import { normalizePhone } from '@/shared/lib/russianPhone'

export { isRussianPhone, normalizePhone } from '@/shared/lib/russianPhone'

export const CTA_FORM_TYPES = ['application', 'callback', 'club'] as const
export const FORM_SUBMISSION_TYPES = [...CTA_FORM_TYPES, 'vacancy'] as const

export type CTAFormType = (typeof CTA_FORM_TYPES)[number]
export type FormSubmissionType = (typeof FORM_SUBMISSION_TYPES)[number]

export function normalizePageUrl(pageUrl: string): string {
  return pageUrl.trim()
}

export function buildCTAFormSubmissionKey({
  clubId,
  formType,
  pageUrl,
  phone,
}: {
  clubId?: number | null
  formType: FormSubmissionType
  pageUrl: string
  phone: string
}): string {
  return createHash('sha256')
    .update([formType, normalizePageUrl(pageUrl), normalizePhone(phone), clubId ?? ''].join('|'))
    .digest('hex')
}
