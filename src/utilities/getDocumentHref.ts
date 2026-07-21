export const getDocumentHref = (relationTo: string, slug?: string | null) => {
  if (!slug) {
    return ''
  }

  if (relationTo === 'pages') {
    return slug === 'home' ? '/' : `/${slug}`
  }

  return `/${relationTo}/${slug}`
}
