import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const clubsToProgramsRedirect = {
    destination: '/programs',
    permanent: true,
    source: '/clubs',
  }

  const clubsToProgramsSlugRedirect = {
    destination: '/programs/:slug',
    permanent: true,
    source: '/clubs/:slug',
  }

  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  return [clubsToProgramsRedirect, clubsToProgramsSlugRedirect, internetExplorerRedirect]
}
