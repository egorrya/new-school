import { HeaderClient } from './Component.client'
import { getGlobal } from '@/utilities/getGlobals'
import React from 'react'

export async function Header() {
  const [headerData, siteSettings] = await Promise.all([
    getGlobal('header', 1),
    getGlobal('site-settings', 1),
  ])

  return <HeaderClient header={headerData} siteSettings={siteSettings} />
}
