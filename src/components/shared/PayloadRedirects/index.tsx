import { getCachedDocument } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { getDocumentHref } from '@/utilities/getDocumentHref'
import { notFound, redirect } from 'next/navigation'
import type React from 'react'

interface Props {
  disableNotFound?: boolean
  url: string
}

export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  const redirects = await getCachedRedirects()()

  const redirectItem = redirects.find((item) => item.from === url)

  if (redirectItem) {
    if (redirectItem.to?.url) {
      redirect(redirectItem.to.url)
    }

    let redirectUrl: string

    if (typeof redirectItem.to?.reference?.value === 'string') {
      const collection = redirectItem.to?.reference?.relationTo
      const id = redirectItem.to?.reference?.value

      const document = (await getCachedDocument(collection, id)()) as { slug?: string | null }
      redirectUrl = getDocumentHref(collection, document?.slug)
    } else {
      redirectUrl = getDocumentHref(
        redirectItem.to?.reference?.relationTo ?? 'pages',
        typeof redirectItem.to?.reference?.value === 'object'
          ? redirectItem.to?.reference?.value?.slug
          : '',
      )
    }

    if (redirectUrl) redirect(redirectUrl)
  }

  if (disableNotFound) return null

  notFound()
}
