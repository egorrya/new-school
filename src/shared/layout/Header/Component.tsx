import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/server/payload/getGlobals'
import React from 'react'

export async function Header() {
  const [headerData, siteSettings] = await Promise.all([
    getCachedGlobal('header', 1)(),
    getCachedGlobal('site-settings', 1)(),
  ])

  return <HeaderClient header={headerData} siteSettings={siteSettings} />
}
