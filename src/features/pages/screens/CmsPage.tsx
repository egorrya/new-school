import type { Metadata } from 'next'

import configPromise from '@payload-config'
import type { News, Redirect } from '@/payload-types'
import { AboutLinksBlock } from '@/features/site/ui/AboutLinksBlock'
import { RenderBlocks } from '@/features/page-builder/RenderBlocks'
import { getGalleryMarqueeImages } from '@/features/gallery/getGalleryMarqueeImages'
import { SiteContactsSection } from '@/shared/layout/SiteContactsSection'
import { generateMeta } from '@/server/seo/generateMeta'
import { getDocumentHref } from '@/shared/lib/getDocumentHref'
import { getCachedDocument } from '@/server/payload/getDocument'
import { queryPageBySlug } from '@/server/payload/getPageBySlug'
import { getCachedRedirects } from '@/server/payload/getRedirects'
import { getServerSideURL } from '@/shared/lib/getURL'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'


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
  const hasHeroMarquee = layout.some((block) => block.blockType === 'heroMarquee')
  const isHome = slug === 'home'
  const isLegalDocument = slug === 'privacy-policy' || slug === 'personal-data'
  const heroBlock = isHome ? layout[0] : undefined
  const remainingBlocks = heroBlock ? layout.slice(1) : layout
  const shouldShowLatestNews =
    heroBlock?.blockType === 'hero'
      ? heroBlock.showLatestNews === true
      : heroBlock?.blockType === 'heroMarquee'
        ? heroBlock.showLatestNews !== false
        : false
  const [latestNews, marqueeImages] = await Promise.all([
    shouldShowLatestNews ? queryLatestNews() : null,
    hasHeroMarquee ? getGalleryMarqueeImages() : [],
  ])

  return (
    <>
      <article className={slug === 'contacts' ? undefined : 'pb-12 sm:pb-16'}>
        {heroBlock ? (
          <RenderBlocks
            blocks={[heroBlock]}
            latestNews={latestNews}
            marqueeImages={marqueeImages}
            pageUrl={pageUrl}
          />
        ) : null}
        {isHome ? <AboutLinksBlock /> : null}
        <RenderBlocks blocks={remainingBlocks} marqueeImages={marqueeImages} pageUrl={pageUrl} />
      </article>
      {slug !== 'contacts' && !isHome && !isLegalDocument ? <SiteContactsSection /> : null}
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const params = paramsPromise ? await paramsPromise : { slug: [] }
  const slug = resolveSlug(params)
  const page = await queryPageBySlug(slug)

  return generateMeta({ doc: page })
}
