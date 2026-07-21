'use client'

import type { FC } from 'react'
import { useEffect } from 'react'
import { useConfig } from '@payloadcms/ui'

const RELOAD_GUARD = 'payload-force-ru-reloaded'

export const ForceRussianLanguage: FC = () => {
  const { config } = useConfig()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const cookiePrefix = config.cookiePrefix || 'payload'
    const languageCookie = `${cookiePrefix}-lng`
    const currentCookie = document.cookie.includes(`${languageCookie}=ru`)

    if (currentCookie) return

    document.cookie = `${languageCookie}=ru; path=/; max-age=31536000; SameSite=Lax`
    document.cookie = `lng=ru; path=/; max-age=31536000; SameSite=Lax`

    if (sessionStorage.getItem(RELOAD_GUARD) !== '1') {
      sessionStorage.setItem(RELOAD_GUARD, '1')
      window.location.reload()
    }
  }, [config.cookiePrefix])

  return null
}

export default ForceRussianLanguage
