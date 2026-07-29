/**
 * Processes media resource URL to ensure proper formatting
 * @param url The original URL from the resource
 * @param cacheTag Optional cache tag to append to the URL
 * @returns Properly formatted URL with cache tag if provided
 *
 * Local paths (e.g. `/api/media/file/image.webp`) are kept relative so
 * Next.js image optimization treats them as local. Payload can return absolute
 * same-origin URLs when `serverURL` is configured, so those are normalized too.
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  let normalizedUrl = url

  try {
    const parsedUrl = new URL(url)
    const sameOriginHosts = [
      process.env.NEXT_PUBLIC_SERVER_URL,
      process.env.__NEXT_PRIVATE_ORIGIN,
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : undefined,
    ]
      .filter((origin): origin is string => Boolean(origin))
      .map((origin) => new URL(origin).host)

    const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(parsedUrl.hostname)
    const isKnownSameOrigin = sameOriginHosts.includes(parsedUrl.host)

    if (isLocalHost || isKnownSameOrigin) {
      normalizedUrl = `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`
    }
  } catch {
    // Relative URLs are already in the format Next.js expects.
  }

  if (!cacheTag) return normalizedUrl

  return `${normalizedUrl}${normalizedUrl.includes('?') ? '&' : '?'}${cacheTag}`
}
