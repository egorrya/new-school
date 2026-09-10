import type { Media as MediaDocument } from '@/payload-types'

export function isMediaDocument(
  resource: number | MediaDocument | null | undefined,
): resource is MediaDocument {
  return typeof resource === 'object' && resource !== null
}
