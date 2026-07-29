import type { Metadata } from 'next'

import configPromise from '@payload-config'
import type { GalleryAlbum } from '@/payload-types'
import Link from 'next/link'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { isMediaDocument } from '@/components/collections/CollectionCards'
import { GalleryAlbumsIntro } from '@/components/collections/GalleryAlbumsIntro'
import { GalleryPhotoSlider } from '@/components/collections/GalleryPhotoSlider'
import { buildGalleryPhotoSlides } from '@/components/collections/galleryPhotoSlides'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockSection,
  PageBlockSurface,
} from '@/components/shared/PageBlock'
import { generateMeta } from '@/lib/generateMeta'

export const dynamic = 'force-dynamic'

type RouteParams = {
  id: string
}

type Args = {
  params?: Promise<RouteParams>
}

const queryGalleryAlbumById = cache(async (id: number) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'gallery-albums',
    depth: 1,
    limit: 1,
    pagination: false,
    overrideAccess: false,
    where: {
      id: {
        equals: id,
      },
    },
  })

  return (result.docs?.[0] as GalleryAlbum | undefined) || null
})

export default async function GalleryAlbumDetailPage({ params: paramsPromise }: Args) {
  const params = paramsPromise ? await paramsPromise : null
  const albumId = Number.parseInt(params?.id || '', 10)

  if (Number.isNaN(albumId)) {
    notFound()
  }

  const album = await queryGalleryAlbumById(albumId)

  if (!album) {
    notFound()
  }

  const images = album.images?.filter(isMediaDocument) ?? []
  const slides = buildGalleryPhotoSlides([album])

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <PageBlockSurface className="bg-card p-6 sm:p-8 lg:p-10">
          <article className="space-y-8">
            <div className="space-y-3">
              <Badge variant="neutral">Альбом</Badge>
              <GalleryAlbumsIntro description={album.description} title={album.title} />
              <Badge variant="neutral">{images.length} фото</Badge>
            </div>

            {images.length > 0 ? (
              <GalleryPhotoSlider slides={slides} />
            ) : (
              <div className="space-y-4">
                <PageBlockEmptyState
                  description="Добавьте фотографии в альбом, чтобы он отображался здесь."
                  title="Фотографии пока не добавлены"
                />
                <Button asChild variant="neutral">
                  <Link href="/gallery-albums">К альбомам</Link>
                </Button>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="neutral">
                <Link href="/gallery-albums">К альбомам</Link>
              </Button>
              <Button asChild>
                <Link href="/">На главную</Link>
              </Button>
            </div>
          </article>
        </PageBlockSurface>
      </PageBlockContainer>
    </PageBlockSection>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const params = paramsPromise ? await paramsPromise : null
  const albumId = Number.parseInt(params?.id || '', 10)

  if (Number.isNaN(albumId)) {
    return generateMeta({ doc: null })
  }

  const album = await queryGalleryAlbumById(albumId)

  if (!album) {
    return generateMeta({ doc: null })
  }

  return generateMeta({
    doc: {
      meta: {
        description: album.description,
        image: album.images?.find(isMediaDocument) ?? null,
      },
      slug: `gallery-albums/${album.id}`,
      title: album.title,
    },
  })
}
