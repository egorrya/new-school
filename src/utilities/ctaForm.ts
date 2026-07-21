import { createHash } from 'node:crypto'

export const CTA_FORM_TYPES = ['application', 'callback', 'club'] as const

export type CTAFormType = (typeof CTA_FORM_TYPES)[number]

export function normalizePhone(phone: string): string {
  return phone.replace(/[^\d]/g, '')
}

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
  formType: CTAFormType
  pageUrl: string
  phone: string
}): string {
  return createHash('sha256')
    .update([formType, normalizePageUrl(pageUrl), normalizePhone(phone), clubId ?? ''].join('|'))
    .digest('hex')
}
