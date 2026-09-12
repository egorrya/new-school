const MIN_FORM_COMPLETION_TIME_MS = 1200

const HONEYPOT_FIELD = 'website'
const FORM_STARTED_AT_FIELD = 'formStartedAt'

export function isSpamFormSubmission(formData: FormData): boolean {
  const honeypotValue = formData.get(HONEYPOT_FIELD)

  if (typeof honeypotValue === 'string' && honeypotValue.trim()) {
    return true
  }

  const startedAtValue = formData.get(FORM_STARTED_AT_FIELD)
  const startedAt = typeof startedAtValue === 'string' ? Number(startedAtValue) : Number.NaN

  return !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FORM_COMPLETION_TIME_MS
}
