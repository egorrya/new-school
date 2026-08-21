import configPromise from '@payload-config'
import type { GalleryAlbum, Media as MediaDocument } from '@/payload-types'
import { getPayload } from 'payload'

import { buildGalleryPhotoSlides } from './galleryPhotoSlides'

const GALLERY_MARQUEE_IMAGE_LIMIT = 16

export async function getGalleryMarqueeImages(): Promise<MediaDocument[]> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'gallery-albums',
    depth: 1,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: '-updatedAt',
  })

  return buildGalleryPhotoSlides(
    result.docs as GalleryAlbum[],
    GALLERY_MARQUEE_IMAGE_LIMIT,
  ).map(({ image }) => image)
}
