export const RUSSIAN_PHONE_MASK = '+7 (999) 123-45-67'

export function normalizePhone(phone: string): string {
  return phone.replace(/[^\d]/gu, '')
}

export function isRussianPhone(phone: string): boolean {
  return /^7\d{10}$/u.test(normalizePhone(phone))
}

export function formatRussianPhone(phone: string): string {
  let digits = normalizePhone(phone)

  if (digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`
  } else if (digits && !digits.startsWith('7')) {
    digits = `7${digits}`
  }

  const subscriberNumber = digits.slice(1, 11)
  let formatted = '+7'

  if (subscriberNumber.length > 0) formatted += ` (${subscriberNumber.slice(0, 3)}`
  if (subscriberNumber.length >= 3) formatted += ')'
  if (subscriberNumber.length > 3) formatted += ` ${subscriberNumber.slice(3, 6)}`
  if (subscriberNumber.length > 6) formatted += `-${subscriberNumber.slice(6, 8)}`
  if (subscriberNumber.length > 8) formatted += `-${subscriberNumber.slice(8, 10)}`

  return formatted
}
