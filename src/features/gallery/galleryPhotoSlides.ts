import type { GalleryAlbum, Media as MediaDocument } from '@/payload-types'

export type GalleryPhotoSlide = {
  id: string
  image: MediaDocument
  albumTitle?: string | null
  title?: string | null
}

export function buildGalleryPhotoSlides(
  albums: GalleryAlbum[],
  limit?: number,
): GalleryPhotoSlide[] {
  const slides: GalleryPhotoSlide[] = []

  for (const album of albums) {
    const images = album.images?.filter(
      (image): image is MediaDocument => typeof image === 'object' && image !== null,
    )

    if (!images?.length) {
      continue
    }

    for (const [index, image] of images.entries()) {
      slides.push({
        id: `${album.id}-${image.id ?? index}`,
        albumTitle: album.title,
        title: image.alt || album.title,
        image,
      })

      if (typeof limit === 'number' && slides.length >= limit) {
        return slides
      }
    }
  }

  return slides
}
