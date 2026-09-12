import type { Payload } from 'payload'
import nodemailer from 'nodemailer'

import type { FormSubmission } from '@/payload-types'
import { parseEmailRecipients } from '@/shared/lib/emailRecipients'

const formTypeLabels = {
  application: 'Заявка',
  callback: 'Обратный звонок',
  club: 'Заявка на программу',
  vacancy: 'Отклик на вакансию',
} as const

function getTransport() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD
  const from = process.env.SMTP_FROM || user
  const configuredPort = Number(process.env.SMTP_PORT || '587')

  if (!host || !from || !Number.isInteger(configuredPort) || configuredPort <= 0) {
    return null
  }

  return {
    from,
    transporter: nodemailer.createTransport({
      auth: user && pass ? { pass, user } : undefined,
      host,
      port: configuredPort,
      secure: process.env.SMTP_SECURE === 'true',
    }),
  }
}

function formatSubmission(submission: FormSubmission): string {
  const lines = [
    `Тип: ${formTypeLabels[submission.formType]}`,
    `Имя: ${submission.name}`,
    `Телефон: ${submission.phone}`,
  ]

  if (submission.email) lines.push(`Email: ${submission.email}`)
  if (submission.job) lines.push(`Вакансия: #${typeof submission.job === 'number' ? submission.job : submission.job.id}`)
  if (submission.club) lines.push(`Программа: #${typeof submission.club === 'number' ? submission.club : submission.club.id}`)
  if (submission.age) lines.push(`Возраст: ${submission.age}`)
  if (submission.city) lines.push(`Город: ${submission.city}`)
  if (submission.education) lines.push(`Образование: ${submission.education === 'higher' ? 'Высшее' : 'Среднее специальное'}`)
  if (submission.educationalInstitution) lines.push(`Учебное заведение: ${submission.educationalInstitution}`)
  if (submission.specialty) lines.push(`Специальность: ${submission.specialty}`)
  if (submission.workExperience) lines.push(`Стаж: ${submission.workExperience}`)
  if (submission.about) lines.push(`О себе: ${submission.about}`)
  lines.push(`Страница: ${submission.pageUrl}`)

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
  if (serverUrl) lines.push(`Открыть в админке: ${serverUrl}/admin/collections/form-submissions/${submission.id}`)

  return lines.join('\n')
}

export async function notifyFormSubmission({
  payload,
  submission,
}: {
  payload: Payload
  submission: FormSubmission
}): Promise<void> {
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    overrideAccess: true,
  })
  const notifications = siteSettings.formNotifications
  const recipients = parseEmailRecipients(notifications?.recipients)

  if (notifications?.enabled === false || recipients.length === 0) {
    return
  }

  const transport = getTransport()
  if (!transport) {
    payload.logger.warn('SMTP is not configured; form submission email was not sent.')
    return
  }

  try {
    await transport.transporter.sendMail({
      from: transport.from,
      subject: `Новая заявка: ${formTypeLabels[submission.formType]}`,
      text: formatSubmission(submission),
      to: recipients,
    })
  } catch (error) {
    payload.logger.error({ error, submissionId: submission.id }, 'Could not send form submission email.')
  }
}
