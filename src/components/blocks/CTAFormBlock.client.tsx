'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { cn } from '@/utilities/ui'

import { initialCTAFormState, type CTAFormAction } from './cta-form.types'

type Props = {
  action: CTAFormAction
  buttonLabel: string
  clubId?: number | null
  formType: string
  pageUrl: string
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()

  return (
    <Button
      className={cn(
        'w-full motion-reduce:transition-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0',
      )}
      disabled={pending}
      type="submit"
    >
      {pending ? 'Отправляем…' : label}
    </Button>
  )
}

function CTAFormFields({
  buttonLabel,
  clubId,
  formType,
  pageUrl,
}: Pick<Props, 'buttonLabel' | 'clubId' | 'formType' | 'pageUrl'>) {
  const { pending } = useFormStatus()

  return (
    <fieldset className="space-y-4" disabled={pending} aria-busy={pending}>
      <input name="pageUrl" type="hidden" value={pageUrl} />
      <input name="formType" type="hidden" value={formType} />
      {typeof clubId === 'number' ? <input name="clubId" type="hidden" value={clubId} /> : null}

      <div className="space-y-2">
        <Label htmlFor="cta-name">Имя</Label>
        <Input
          autoComplete="name"
          id="cta-name"
          name="name"
          placeholder="Как к вам обращаться"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cta-phone">Телефон</Label>
        <Input
          autoComplete="tel"
          id="cta-phone"
          inputMode="tel"
          name="phone"
          placeholder="+7 (___) ___-__-__"
          required
          type="tel"
        />
      </div>

      <div className="rounded-base border-2 border-border bg-secondary-background/40 p-4">
        <div className="flex items-start gap-3">
          <Checkbox id="cta-consent" name="consentAccepted" required />
          <div className="space-y-1">
            <Label className="cursor-pointer leading-snug" htmlFor="cta-consent">
              <span>Согласен(-на) с </span>
              <a
                className="underline underline-offset-2 transition-colors hover:text-main"
                href="/privacy-policy"
                rel="noreferrer"
                target="_blank"
              >
                политикой конфиденциальности
              </a>
              <span> и </span>
              <a
                className="underline underline-offset-2 transition-colors hover:text-main"
                href="/personal-data"
                rel="noreferrer"
                target="_blank"
              >
                документом по персональным данным
              </a>
            </Label>
          </div>
        </div>
      </div>

      <SubmitButton label={buttonLabel} />
    </fieldset>
  )
}

export function CTAFormClient({ action, buttonLabel, clubId, formType, pageUrl }: Props) {
  const [state, formAction] = useActionState(action, initialCTAFormState)

  useEffect(() => {
    if (state.status === 'success') {
      toast.success(state.message)
      return
    }

    if (state.status === 'error') {
      toast.error(state.message)
    }
  }, [state.eventId, state.message, state.status])

  const formKey = state.status === 'success' ? `success-${state.eventId}` : 'active'

  return (
    <Card className="bg-background">
      <CardContent className="p-5 sm:p-6">
        <form key={formKey} action={formAction} className="space-y-4">
          <CTAFormFields buttonLabel={buttonLabel} clubId={clubId} formType={formType} pageUrl={pageUrl} />

          {state.status !== 'idle' ? (
            <Alert variant={state.status === 'error' ? 'destructive' : 'default'}>
              <AlertTitle>
                {state.status === 'error' ? 'Не удалось отправить заявку' : 'Заявка отправлена'}
              </AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          ) : null}
        </form>
      </CardContent>
    </Card>
  )
}
