import type {
  Club,
  CollectionGridBlock as CollectionGridBlockType,
  GalleryAlbum,
  Job,
  News,
  Review,
  Teacher,
} from '@/payload-types'

import { ClubCard } from '@/components/clubs/ClubCard'
import {
  JobCard,
  NewsCard,
  TeacherCard,
} from '@/components/collections/CollectionCards'
import {
  GalleryPhotoSlider,
} from '@/components/collections/GalleryPhotoSlider'
import { buildGalleryPhotoSlides } from '@/components/collections/galleryPhotoSlides'
import { CollectionGridHeader } from '@/components/blocks/CollectionGridHeader'
import { CollectionGridReveal } from '@/components/blocks/CollectionGridReveal'
import { TestimonialsCarousel } from '@/components/blocks/TestimonialsCarousel.client'
import { toTestimonialItems } from '@/components/blocks/testimonials'

import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockSection,
} from '@/components/shared/PageBlock'

type CollectionType = CollectionGridBlockType['collectionType']

type CollectionDocuments = {
  clubs: Club
  news: News
  teachers: Teacher
  reviews: Review
  jobs: Job
  galleryAlbums: GalleryAlbum
}

const collectionSorts: Record<CollectionType, string> = {
  clubs: 'sortOrder,title',
  news: '-publishedAt',
  teachers: 'sortOrder',
  reviews: 'sortOrder',
  jobs: '-createdAt',
  galleryAlbums: 'sortOrder',
}

async function getCollectionDocuments<T extends CollectionType>(
  collectionType: T,
  itemLimit: number | null | undefined,
  draft: boolean,
  galleryAlbum?: CollectionGridBlockType['galleryAlbum'],
): Promise<CollectionDocuments[T][]> {
  const payload = await getPayload({ config: configPromise })
  const now = new Date().toISOString()
  const resolvedItemLimit = itemLimit ?? 6

  switch (collectionType) {
    case 'clubs': {
      const result = await payload.find({
        collection: 'clubs',
        depth: 1,
        limit: resolvedItemLimit,
        draft,
        overrideAccess: draft,
        sort: collectionSorts.clubs,
        pagination: false,
        where: {
          isActive: {
            equals: true,
          },
        },
      })
      return result.docs as CollectionDocuments[T][]
    }
    case 'news': {
      const result = await payload.find({
        collection: 'news',
        depth: 1,
        limit: resolvedItemLimit,
        overrideAccess: false,
        sort: collectionSorts.news,
        pagination: false,
        where: {
          publishedAt: {
            less_than_equal: now,
          },
        },
      })
      return result.docs as CollectionDocuments[T][]
    }
    case 'teachers': {
      const result = await payload.find({
        collection: 'teachers',
        depth: 1,
        limit: resolvedItemLimit,
        overrideAccess: false,
        sort: collectionSorts.teachers,
        pagination: false,
      })
      return result.docs as CollectionDocuments[T][]
    }
    case 'reviews': {
      const result = await payload.find({
        collection: 'reviews',
        depth: 1,
        limit: resolvedItemLimit,
        overrideAccess: false,
        sort: collectionSorts.reviews,
        pagination: false,
        where: {
          isPublished: {
            equals: true,
          },
        },
      })
      return result.docs as CollectionDocuments[T][]
    }
    case 'jobs': {
      const result = await payload.find({
        collection: 'jobs',
        depth: 1,
        limit: resolvedItemLimit,
        overrideAccess: false,
        sort: collectionSorts.jobs,
        pagination: false,
        where: {
          isActive: {
            equals: true,
          },
        },
      })
      return result.docs as CollectionDocuments[T][]
    }
    case 'galleryAlbums': {
      const galleryAlbumId =
        typeof galleryAlbum === 'object' && galleryAlbum !== null ? galleryAlbum.id : galleryAlbum

      if (galleryAlbumId) {
        const album = await payload.findByID({
          collection: 'gallery-albums',
          id: galleryAlbumId,
          depth: 1,
          overrideAccess: false,
        })

        return [album] as CollectionDocuments[T][]
      }

      const result = await payload.find({
        collection: 'gallery-albums',
        depth: 1,
        limit: 100,
        overrideAccess: false,
        sort: collectionSorts.galleryAlbums,
        pagination: false,
      })
      return result.docs as CollectionDocuments[T][]
    }
  }

  throw new Error(`Unsupported collection type: ${collectionType}`)
}

export async function CollectionGridBlock({
  collectionType,
  description,
  galleryAlbum,
  hideTitle,
  itemLimit,
  title,
}: CollectionGridBlockType) {
  const { isEnabled: draft } = await draftMode()
  const items = await getCollectionDocuments(collectionType, itemLimit, draft, galleryAlbum)
  const gallerySlides =
    collectionType === 'galleryAlbums'
      ? buildGalleryPhotoSlides(items as GalleryAlbum[])
      : []

  return (
    <PageBlockSection
      className={
        collectionType === 'reviews'
          ? 'flex min-h-[calc(100dvh-var(--site-header-height,0px))] items-center'
          : undefined
      }
    >
      <PageBlockContainer>
        <div className="space-y-8">
          <CollectionGridHeader
            className="mx-auto max-w-4xl text-center"
            description={description}
            descriptionClassName="mx-auto max-w-3xl text-center"
            title={hideTitle ? null : title}
            titleClassName="w-full text-2xl sm:text-3xl lg:text-4xl"
          />

          <CollectionGridReveal>
            {collectionType === 'galleryAlbums' ? (
              gallerySlides.length > 0 ? (
                <GalleryPhotoSlider slides={gallerySlides} />
              ) : (
                <PageBlockEmptyState
                  description="Добавьте альбомы с фотографиями в Payload, чтобы собрать галерею в слайдер."
                  title="Фотографии пока не добавлены"
                />
              )
            ) : collectionType === 'reviews' && items.length > 0 ? (
              <TestimonialsCarousel testimonials={toTestimonialItems(items as Review[])} />
            ) : items.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {collectionType === 'clubs'
                  ? (items as Club[]).map((item, index) => (
                      <ClubCard key={item.id || `${item.title}-${index}`} club={item} />
                    ))
                  : null}
                {collectionType === 'news'
                  ? (items as News[]).map((item, index) => (
                      <NewsCard
                        key={item.id || `${item.title}-${index}`}
                        news={item}
                        priority={index === 0}
                      />
                    ))
                  : null}
                {collectionType === 'teachers'
                  ? (items as Teacher[]).map((item, index) => (
                      <TeacherCard key={item.id || `${item.name}-${index}`} teacher={item} />
                    ))
                  : null}
                {collectionType === 'jobs'
                  ? (items as Job[]).map((item, index) => (
                      <JobCard key={item.id || `${item.title}-${index}`} job={item} />
                    ))
                  : null}
              </div>
            ) : (
              <PageBlockEmptyState
                description={
                  collectionType === 'clubs'
                    ? 'Добавьте хотя бы один активный кружок в Payload, чтобы он появился в этой сетке.'
                    : collectionType === 'news'
                      ? 'Добавьте опубликованные новости в Payload, чтобы они появились в этой сетке.'
                      : collectionType === 'teachers'
                        ? 'Добавьте преподавателей с фото и описанием, чтобы показать эту секцию.'
                        : collectionType === 'reviews'
                          ? 'Добавьте опубликованные отзывы, чтобы показать социальное доказательство.'
                          : collectionType === 'jobs'
                            ? 'Добавьте активные вакансии, чтобы их увидели посетители.'
                            : 'Добавьте альбомы галереи с фотографиями, чтобы показать эту секцию.'
                }
                title={
                  collectionType === 'clubs'
                    ? 'Активные кружки пока не найдены'
                    : collectionType === 'news'
                      ? 'Новостей пока нет'
                      : collectionType === 'teachers'
                        ? 'Преподаватели пока не добавлены'
                      : collectionType === 'reviews'
                        ? 'Отзывы пока не добавлены'
                        : collectionType === 'jobs'
                          ? 'Вакансии пока не добавлены'
                          : 'Альбомы галереи пока не добавлены'
                }
              />
            )}
          </CollectionGridReveal>
        </div>
      </PageBlockContainer>
    </PageBlockSection>
  )
}
