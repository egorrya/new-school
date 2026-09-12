'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'

import { FormAntiSpamFields } from '@/shared/components/FormAntiSpamFields'
import { formatRussianPhone, RUSSIAN_PHONE_MASK } from '@/shared/lib/russianPhone'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/primitives/alert'
import { Button } from '@/shared/ui/primitives/button'
import { Card, CardContent } from '@/shared/ui/primitives/card'
import { Checkbox } from '@/shared/ui/primitives/checkbox'
import { Input } from '@/shared/ui/primitives/input'
import { Label } from '@/shared/ui/primitives/label'

import { cn } from '@/shared/lib/cn'
import { useIsMobileViewport } from '@/shared/hooks/useIsMobileViewport'

import { initialCTAFormState, type CTAFormAction } from './types'

type Props = {
  action: CTAFormAction
  buttonLabel: string
  clubId?: number | null
  formType: string
  pageUrl: string
  title: string
}

const cardReveal = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.9, duration: 0.25, ease: 'easeOut' as const },
  },
}

const mobileCardReveal = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.12, duration: 0.28, ease: 'easeOut' as const },
  },
}

const cardRevealViewport = { amount: 0.1, margin: '-15% 0px -15% 0px', once: true } as const

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
      <FormAntiSpamFields />

      <div className="space-y-2">
        <Label htmlFor="cta-name">Имя</Label>
        <Input
          autoComplete="name"
          id="cta-name"
          name="name"
          onChange={(event) => event.currentTarget.setCustomValidity('')}
          onInvalid={(event) => event.currentTarget.setCustomValidity('Пожалуйста, укажите ваше имя.')}
          placeholder="Как к вам обращаться"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cta-phone">Телефон</Label>
        <Input
          autoComplete="tel"
          defaultValue="+7"
          id="cta-phone"
          inputMode="tel"
          maxLength={18}
          name="phone"
          onChange={(event) => {
            event.currentTarget.value = formatRussianPhone(event.currentTarget.value)
            event.currentTarget.setCustomValidity('')
          }}
          onInvalid={(event) => event.currentTarget.setCustomValidity(`Введите номер в формате ${RUSSIAN_PHONE_MASK}.`)}
          pattern="\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}"
          placeholder={RUSSIAN_PHONE_MASK}
          required
          type="tel"
        />
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="cta-consent"
          name="consentAccepted"
          onInvalid={(event) => event.currentTarget.setCustomValidity('Поставьте галочку, чтобы отправить заявку.')}
          required
        />
        <Label className="cursor-pointer text-sm leading-snug text-foreground" htmlFor="cta-consent">
          <span>Даю согласие на обработку персональных данных в соответствии с </span>
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
            согласием на обработку персональных данных
          </a>
        </Label>
      </div>

      <SubmitButton label={buttonLabel} />
    </fieldset>
  )
}

export function CTAFormClient({ action, buttonLabel, clubId, formType, pageUrl, title }: Props) {
  const [state, formAction] = useActionState(action, initialCTAFormState)
  const shouldReduceMotion = useReducedMotion() ?? false
  const isMobile = useIsMobileViewport()
  const revealVariants = isMobile ? mobileCardReveal : cardReveal

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
    <motion.div
      initial={shouldReduceMotion ? undefined : 'hidden'}
      variants={shouldReduceMotion ? undefined : revealVariants}
      viewport={cardRevealViewport}
      whileInView={shouldReduceMotion ? undefined : 'visible'}
    >
      <Card className="bg-background">
        <CardContent className="space-y-4 p-5 sm:p-6">
          <h3 className="font-heading text-xl leading-tight">{title}</h3>
          <form key={formKey} action={formAction}>
            <CTAFormFields buttonLabel={buttonLabel} clubId={clubId} formType={formType} pageUrl={pageUrl} />

            {state.status !== 'idle' ? (
              <Alert className="mt-4" variant={state.status === 'error' ? 'destructive' : 'default'}>
                <AlertTitle>
                  {state.status === 'error' ? 'Не удалось отправить заявку' : 'Заявка отправлена'}
                </AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
