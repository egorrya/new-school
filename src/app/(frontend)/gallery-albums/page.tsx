import type { Metadata } from 'next'

import configPromise from '@payload-config'
import type { GalleryAlbum } from '@/payload-types'
import { cache } from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'

import {
  GalleryPhotoSlider,
  buildGalleryPhotoSlides,
} from '@/components/collections/GalleryPhotoSlider'
import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
  PageBlockSurface,
} from '@/components/shared/PageBlock'
import { Button } from '@/components/ui/button'
import { generateMeta } from '@/lib/generateMeta'

export const dynamic = 'force-dynamic'

const queryGalleryAlbums = cache(async () => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'gallery-albums',
    depth: 1,
    limit: 100,
    pagination: false,
    overrideAccess: false,
    sort: 'sortOrder,title',
  })

  return result.docs as GalleryAlbum[]
})

export default async function GalleryAlbumsPage() {
  const albums = await queryGalleryAlbums()
  const slides = buildGalleryPhotoSlides(albums)

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <PageBlockSurface className="bg-card p-6 sm:p-8 lg:p-10">
          <div className="space-y-8">
            <PageBlockHeader
              description="Фотографии с событий, поездок и школьной жизни."
              headingLevel={1}
              title="Галерея"
              titleClassName="text-3xl sm:text-4xl lg:text-5xl"
            />

            {slides.length > 0 ? (
              <GalleryPhotoSlider slides={slides} />
            ) : (
              <div className="space-y-4">
                <PageBlockEmptyState
                  description="Добавьте фотографии в альбомы галереи в Payload, чтобы они появились в этом разделе."
                  title="Фотографии пока не добавлены"
                />
                <Button asChild>
                  <Link href="/">На главную</Link>
                </Button>
              </div>
            )}
          </div>
        </PageBlockSurface>
      </PageBlockContainer>
    </PageBlockSection>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    doc: {
      slug: 'gallery-albums',
      title: 'Галерея',
    },
  })
}
