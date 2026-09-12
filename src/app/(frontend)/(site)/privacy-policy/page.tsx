import type { Metadata } from 'next'

import { LegalDocumentPage } from '@/features/legal/screens/LegalDocumentPage'

export const metadata: Metadata = {
  description: 'Политика конфиденциальности сайта «Новая школа».',
  title: 'Политика конфиденциальности',
}

export default function PrivacyPolicyPage() {
  return <LegalDocumentPage document="privacy-policy" />
}
