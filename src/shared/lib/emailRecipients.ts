const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u

export function parseEmailRecipients(value: unknown): string[] {
  if (typeof value !== 'string') {
    return []
  }

  return [...new Set(value.split(/[;,\n]/u).map((email) => email.trim().toLowerCase()).filter(Boolean))]
}

export function validateEmailRecipients(value: unknown): true | string {
  const recipients = parseEmailRecipients(value)

  if (typeof value === 'string' && value.trim() && recipients.some((email) => !emailPattern.test(email))) {
    return 'Укажите корректные адреса электронной почты.'
  }

  return true
}
