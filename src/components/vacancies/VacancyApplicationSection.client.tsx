'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'

import { type CTAFormAction, initialCTAFormState } from '@/components/blocks/cta-form.types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type SelectedJob = {
  id: number
  title: string
}

type Props = {
  action: CTAFormAction
  selectedJob: SelectedJob | null
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button className="w-full sm:w-auto" disabled={pending} type="submit">
      {pending ? 'Отправляем…' : 'Отправить анкету'}
    </Button>
  )
}

export function VacancyApplicationSectionClient({ action, selectedJob }: Props) {
  const [state, formAction] = useActionState(action, initialCTAFormState)
  const [isOpen, setIsOpen] = useState(Boolean(selectedJob))

  useEffect(() => {
    if (state.status === 'error') {
      toast.error(state.message)
    }
  }, [state.eventId, state.message, state.status])

  return (
    <section className="scroll-mt-24 py-12 sm:py-16 lg:py-20" id="application-form">
      <div className="mx-auto max-w-3xl space-y-5 text-center">
        <h2 className="font-heading text-2xl leading-[1.1] sm:text-3xl">Стать частью нашей команды</h2>
        <p className="text-base leading-relaxed text-foreground/80 sm:text-lg">
          Если подходящей вакансии сейчас нет, но вы хотите стать частью нашей команды,
          заполните, пожалуйста, анкету.
        </p>
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
          <DialogTrigger asChild>
            <Button type="button">Заполнить анкету</Button>
          </DialogTrigger>

          <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-3xl overflow-y-auto p-5 sm:max-w-3xl sm:p-6">
            <DialogHeader className="pr-8 text-left">
              <DialogTitle className="text-xl">Анкета соискателя</DialogTitle>
              <DialogDescription className="leading-relaxed text-foreground/80">
                {selectedJob
                  ? `Отклик на вакансию: ${selectedJob.title}`
                  : 'Заполните анкету — мы обязательно её рассмотрим.'}
              </DialogDescription>
            </DialogHeader>

            {state.status === 'success' ? (
              <div className="space-y-5">
                <Alert>
                  <AlertTitle>Анкета отправлена</AlertTitle>
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
                <DialogClose asChild>
                  <Button type="button" variant="neutral">
                    Закрыть
                  </Button>
                </DialogClose>
              </div>
            ) : (
              <form action={formAction} className="space-y-6">
                <ApplicationFields selectedJob={selectedJob} />

                {state.status === 'error' ? (
                  <Alert variant="destructive">
                    <AlertTitle>Не удалось отправить анкету</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                  </Alert>
                ) : null}
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

function ApplicationFields({ selectedJob }: { selectedJob: SelectedJob | null }) {
  const { pending } = useFormStatus()

  return (
    <fieldset aria-busy={pending} className="space-y-6" disabled={pending}>
      {selectedJob ? <input name="jobId" type="hidden" value={selectedJob.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="vacancy-name">ФИО</Label>
          <Input
            autoComplete="name"
            id="vacancy-name"
            name="name"
            placeholder="Иванов Иван Иванович"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vacancy-age">Возраст</Label>
          <Input id="vacancy-age" max="100" min="14" name="age" required type="number" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vacancy-city">Город проживания</Label>
          <Input autoComplete="address-level2" id="vacancy-city" name="city" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vacancy-phone">Номер телефона</Label>
          <Input
            autoComplete="tel"
            id="vacancy-phone"
            inputMode="tel"
            name="phone"
            placeholder="+7 (___) ___-__-__"
            required
            type="tel"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vacancy-email">Адрес электронной почты</Label>
          <Input autoComplete="email" id="vacancy-email" name="email" required type="email" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vacancy-education">Образование</Label>
        <select
          className="flex h-10 w-full rounded-base border border-border bg-secondary-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
          defaultValue=""
          id="vacancy-education"
          name="education"
          required
        >
          <option disabled value="">
            Выберите образование
          </option>
          <option value="higher">Высшее</option>
          <option value="vocational">Среднее специальное</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vacancy-institution">
          Учебное заведение и год окончания{' '}
          <span className="font-normal text-foreground/60">(если есть образование)</span>
        </Label>
        <Textarea
          id="vacancy-institution"
          name="educationalInstitution"
          placeholder="Название учебного заведения, год окончания"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vacancy-specialty">Специальность по диплому</Label>
        <Input id="vacancy-specialty" name="specialty" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vacancy-experience">Стаж работы по специальности</Label>
        <Textarea id="vacancy-experience" name="workExperience" placeholder="Например: 3 года" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vacancy-about">Что вы можете ещё рассказать о себе</Label>
        <Textarea id="vacancy-about" name="about" required />
      </div>

      <div className="space-y-4 border-t border-border pt-5">
        <Button asChild size="sm" type="button" variant="neutral">
          <a href="/privacy-policy" rel="noreferrer" target="_blank">
            Политика конфиденциальности
          </a>
        </Button>

        <div className="flex items-start gap-3">
          <Checkbox id="vacancy-consent" name="consentAccepted" required />
          <Label className="cursor-pointer text-sm leading-snug text-foreground/80" htmlFor="vacancy-consent">
            Даю согласие на обработку персональных данных в соответствии с{' '}
            <a
              className="underline underline-offset-2 transition-colors sm:hover:text-main"
              href="/personal-data"
              rel="noreferrer"
              target="_blank"
            >
              условиями согласия
            </a>
            .
          </Label>
        </div>
      </div>

      <SubmitButton />
    </fieldset>
  )
}
