import type { Metadata } from 'next'

import { LegalDocumentPage } from '@/features/legal/screens/LegalDocumentPage'

export const metadata: Metadata = {
  description: 'Согласие на обработку персональных данных на сайте «Новая школа».',
  title: 'Согласие на обработку персональных данных',
}

export default function PersonalDataPage() {
  return <LegalDocumentPage document="personal-data" />
}
