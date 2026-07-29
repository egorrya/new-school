import type { Metadata } from 'next'

import configPromise from '@payload-config'
import type { Page as PageDocument, Redirect } from '@/payload-types'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { generateMeta } from '@/lib/generateMeta'
import { getDocumentHref } from '@/utilities/getDocumentHref'
import { getCachedDocument } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { getServerSideURL } from '@/utilities/getURL'
import { draftMode } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'

export const dynamic = 'force-dynamic'

type RouteParams = {
  slug: string[]
}

type Args = {
  params?: Promise<RouteParams>
}

const resolveSlug = (params?: RouteParams | null) => params?.slug?.join('/') || 'home'

const queryPageBySlug = cache(async (slug: string) => {
  try {
    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'pages',
      draft,
      depth: 2,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return (result.docs?.[0] as PageDocument | undefined) || null
  } catch {
    return null
  }
})

const resolveRedirectUrl = cache(async (url: string) => {
  const redirects = (await getCachedRedirects()()) as Redirect[]
  const redirectItem = redirects.find((item) => item.from === url)

  if (!redirectItem) {
    return null
  }

  if (redirectItem.to?.url) {
    return redirectItem.to.url
  }

  const reference = redirectItem.to?.reference as
    | {
        relationTo: Parameters<typeof getCachedDocument>[0]
        value?: string | { slug?: string | null } | null
      }
    | null

  if (!reference) {
    return null
  }

  if (typeof reference.value === 'string') {
    const document = (await getCachedDocument(reference.relationTo, reference.value)()) as
      | {
          slug?: string | null
        }
      | null

    return getDocumentHref(reference.relationTo, document?.slug)
  }

  return getDocumentHref(reference.relationTo, reference.value?.slug)
})

export default async function Page({ params: paramsPromise }: Args) {
  const params = paramsPromise ? await paramsPromise : { slug: [] }
  const slug = resolveSlug(params)
  const url = `/${slug}`
  const pageUrl = new URL(url, getServerSideURL()).toString()

  const [page, redirectUrl] = await Promise.all([queryPageBySlug(slug), resolveRedirectUrl(url)])

  if (redirectUrl) {
    redirect(redirectUrl)
  }

  if (!page) {
    notFound()
  }

  return (
    <article className={slug === 'contacts' ? undefined : 'pb-24'}>
      <RenderBlocks blocks={page.layout} pageUrl={pageUrl} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const params = paramsPromise ? await paramsPromise : { slug: [] }
  const slug = resolveSlug(params)
  const page = await queryPageBySlug(slug)

  return generateMeta({ doc: page })
}
