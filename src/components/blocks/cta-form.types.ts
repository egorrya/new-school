import type { CTAFormType } from '@/utilities/ctaForm'

export type CTAFormState = {
  status: 'idle' | 'error' | 'success'
  message: string
  eventId: string
}

export type CTAFormAction = (
  previousState: CTAFormState,
  formData: FormData,
) => Promise<CTAFormState>

export const initialCTAFormState: CTAFormState = {
  eventId: 'idle',
  message: '',
  status: 'idle',
}

export type { CTAFormType }
