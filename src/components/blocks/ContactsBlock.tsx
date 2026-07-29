import { headers } from 'next/headers'

import type { ContactsBlock as ContactsBlockType } from '@/payload-types'

import { CTAFormBlock } from '@/components/blocks/CTAFormBlock'
import { SiteMapEmbed } from '@/components/layout/SiteMapEmbed'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'

export async function ContactsBlock({ title, description }: ContactsBlockType) {
  const siteSettings = await getCachedGlobal('site-settings', 1)()
  const contactsSection = siteSettings?.contactsSection

  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'
  const pageUrl = new URL(pathname, getServerSideURL()).toString()

  return (
    <div className="flex min-h-[calc(100dvh-var(--site-header-height,0px)-var(--site-secondary-header-height,0px))] flex-col justify-center">
      <CTAFormBlock
        buttonLabel="Отправить заявку"
        description={
          description ||
          'Позвоните, напишите в мессенджер или оставьте заявку — мы свяжемся с вами в ближайшее время.'
        }
        formType="application"
        pageUrl={pageUrl}
        title={title || 'Оставить заявку'}
      />
      {contactsSection?.mapEmbedUrl ? <SiteMapEmbed src={contactsSection.mapEmbedUrl} /> : null}
    </div>
  )
}
