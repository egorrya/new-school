type CollectionType = 'clubs' | 'news' | 'teachers' | 'reviews' | 'jobs' | 'galleryAlbums'

/**
 * Maps collection types to their premade "view all" listing page.
 * Only collections with a real listing route belong here — the
 * "показать кнопку" block option is only offered for these types.
 */
export const collectionListingPaths: Partial<Record<CollectionType, string>> = {
  news: '/news',
  jobs: '/vacancies',
  galleryAlbums: '/gallery-albums',
}
