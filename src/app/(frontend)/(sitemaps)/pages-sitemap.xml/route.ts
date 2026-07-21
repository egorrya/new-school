import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const dateFallback = new Date().toISOString()

    const [pagesResult, newsResult, clubsResult, galleryAlbumsResult] = await Promise.all([
      payload.find({
        collection: 'pages',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        where: {
          _status: {
            equals: 'published',
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      payload.find({
        collection: 'news',
        overrideAccess: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        sort: '-publishedAt',
        where: {
          publishedAt: {
            less_than_equal: dateFallback,
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      payload.find({
        collection: 'clubs',
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        overrideAccess: false,
        sort: 'sortOrder,title',
        where: {
          isActive: {
            equals: true,
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      payload.find({
        collection: 'gallery-albums',
        overrideAccess: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        sort: 'sortOrder,title',
        select: {
          id: true,
          updatedAt: true,
        },
      }),
    ])

    const sitemap = [
      ...(pagesResult.docs || []).filter((page) => Boolean(page?.slug)).map((page) => {
        return {
          loc: page?.slug === 'home' ? `${SITE_URL}/` : `${SITE_URL}/${page?.slug}`,
          lastmod: page.updatedAt || dateFallback,
        }
      }),
      ...(newsResult.docs || []).map((news) => ({
        loc: `${SITE_URL}/news/${news.slug}`,
        lastmod: news.updatedAt || dateFallback,
      })),
      ...(clubsResult.docs || []).map((club) => ({
        loc: `${SITE_URL}/clubs/${club.slug}`,
        lastmod: club.updatedAt || dateFallback,
      })),
      ...(galleryAlbumsResult.docs || []).map((album) => ({
        loc: `${SITE_URL}/gallery-albums/${album.id}`,
        lastmod: album.updatedAt || dateFallback,
      })),
      {
        loc: `${SITE_URL}/news`,
        lastmod: dateFallback,
      },
      {
        loc: `${SITE_URL}/gallery-albums`,
        lastmod: dateFallback,
      },
    ]

    return sitemap
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
