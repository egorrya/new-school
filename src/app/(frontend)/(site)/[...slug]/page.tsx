import type { Metadata } from 'next'

import configPromise from '@payload-config'
import type { News, Redirect } from '@/payload-types'
import { AboutLinksBlock } from '@/components/blocks/AboutLinksBlock'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { SiteContactsSection } from '@/components/layout/SiteContactsSection'
import { generateMeta } from '@/lib/generateMeta'
import { getDocumentHref } from '@/utilities/getDocumentHref'
import { getCachedDocument } from '@/utilities/getDocument'
import { queryPageBySlug } from '@/utilities/getPageBySlug'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { getServerSideURL } from '@/utilities/getURL'
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

const queryLatestNews = cache(async () => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'news',
    depth: 0,
    limit: 1,
    pagination: false,
    overrideAccess: false,
    sort: '-publishedAt',
    where: {
      publishedAt: {
        less_than_equal: new Date().toISOString(),
      },
    },
  })

  return (result.docs[0] as News | undefined) ?? null
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

  const reference = redirectItem.to?.reference as {
    relationTo: Parameters<typeof getCachedDocument>[0]
    value?: string | { slug?: string | null } | null
  } | null

  if (!reference) {
    return null
  }

  if (typeof reference.value === 'string') {
    const document = (await getCachedDocument(reference.relationTo, reference.value)()) as {
      slug?: string | null
    } | null

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

  const layout = page.layout ?? []
  const isHome = slug === 'home'
  const heroBlock = isHome ? layout[0] : undefined
  const remainingBlocks = heroBlock ? layout.slice(1) : layout
  const shouldShowLatestNews =
    heroBlock?.blockType === 'hero'
      ? heroBlock.showLatestNews === true
      : heroBlock?.blockType === 'heroMarquee'
        ? heroBlock.showLatestNews !== false
        : false
  const latestNews = shouldShowLatestNews ? await queryLatestNews() : null

  return (
    <>
      <article className={slug === 'contacts' ? undefined : 'pb-12 sm:pb-16'}>
        {heroBlock ? (
          <RenderBlocks blocks={[heroBlock]} latestNews={latestNews} pageUrl={pageUrl} />
        ) : null}
        {isHome ? <AboutLinksBlock /> : null}
        <RenderBlocks blocks={remainingBlocks} pageUrl={pageUrl} />
      </article>
      {slug !== 'contacts' && !isHome ? <SiteContactsSection /> : null}
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const params = paramsPromise ? await paramsPromise : { slug: [] }
  const slug = resolveSlug(params)
  const page = await queryPageBySlug(slug)

  return generateMeta({ doc: page })
}
