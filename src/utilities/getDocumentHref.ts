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

  return `/${relationTo}/${slug}`
}
