import { headers } from 'next/headers'

import { CTAFormBlock } from '@/features/page-builder/blocks/CTAFormBlock/View'
import { getCachedGlobal } from '@/server/payload/getGlobals'
import { getServerSideURL } from '@/shared/lib/getURL'

import { SiteMapEmbed } from './SiteMapEmbed'

export async function SiteContactsSection() {
  const siteSettings = await getCachedGlobal('site-settings', 1)()
  const contactsSection = siteSettings?.contactsSection

  if (contactsSection?.enabled === false) {
    return null
  }

  const headersList = await headers()
  const pathname = headersList.get('x-pathname')
  const pageUrl = new URL(pathname || '/', getServerSideURL()).toString()

  return (
    <>
      <CTAFormBlock
        buttonLabel="Отправить заявку"
        description="Позвоните, напишите в мессенджер или оставьте заявку — мы свяжемся с вами в ближайшее время."
        formType="application"
        pageUrl={pageUrl}
        title="Оставить заявку"
      />
      {contactsSection?.mapEmbedUrl ? <SiteMapEmbed src={contactsSection.mapEmbedUrl} /> : null}
    </>
  )
}
