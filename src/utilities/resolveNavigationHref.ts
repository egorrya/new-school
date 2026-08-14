import type { Header } from '@/payload-types'

import { getDocumentHref } from '@/utilities/getDocumentHref'

type HeaderNavigationItem = NonNullable<Header['navigationLinks']>[number]
type HeaderSubNavigationItem = NonNullable<HeaderNavigationItem['subLinks']>[number]
type SecondaryHeaderItem = NonNullable<Header['secondaryHeaderLinks']>[number]

export function resolveHref(
  link:
    HeaderNavigationItem['link'] | HeaderSubNavigationItem['link'] | SecondaryHeaderItem['link'],
) {
  if (link.type === 'reference') {
    if (!link.reference) {
      return ''
    }

    const reference = link.reference.value

    if (reference && typeof reference === 'object' && 'slug' in reference) {
      return getDocumentHref(link.reference.relationTo, reference.slug)
    }
  }

  return link.url?.trim() || ''
}
