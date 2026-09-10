export const getDocumentHref = (relationTo: string, slug?: string | null) => {
  if (!slug) {
    return ''
  }

  if (relationTo === 'pages') {
    return slug === 'home' ? '/' : `/${slug}`
  }

  if (relationTo === 'org-info-sections') {
    return `/organization-info/${slug}`
  }

  if (relationTo === 'clubs') {
    return `/programs/${slug}`
  }

  if (relationTo === 'programCategories') {
    return `/programs/category/${slug}`
  }

  return `/${relationTo}/${slug}`
}
