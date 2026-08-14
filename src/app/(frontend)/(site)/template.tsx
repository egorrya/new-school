import React from 'react'

import { SiteContactsSection } from '@/components/layout/SiteContactsSection'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SiteContactsSection />
    </>
  )
}
