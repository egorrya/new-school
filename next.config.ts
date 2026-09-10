import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)
import { redirects } from './redirects'

const NEXT_PUBLIC_SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000')

const isLocalServerURL = (() => {
  try {
    return ['localhost', '127.0.0.1', '::1'].includes(new URL(NEXT_PUBLIC_SERVER_URL).hostname)
  } catch {
    return false
  }
})()

const nextConfig: NextConfig = {
  // The production Dockerfile runs the traced standalone server from `.next/standalone`.
  output: 'standalone',
  experimental: {
    // The public site uses a compact Tailwind bundle. Inlining it removes the
    // render-blocking stylesheet request on first visits without changing the UI.
    inlineCss: true,
  },
  // Temporarily required on Windows until Next.js fixes Turbopack Sass resolution.
  // See: https://github.com/vercel/next.js/issues/86431
  sassOptions: {
    loadPaths: ['./node_modules/@payloadcms/ui/dist/scss/'],
  },
  images: {
    dangerouslyAllowLocalIP: isLocalServerURL,
    localPatterns: [
      {
        pathname: '/media/**',
      },
      {
        pathname: '/api/media/file/**',
      },
    ],
    qualities: [65, 75, 100],
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', '') as 'http' | 'https',
        }
      }),
      ...(process.env.S3_PUBLIC_URL
        ? [
            {
              hostname: new URL(process.env.S3_PUBLIC_URL).hostname,
              protocol: new URL(process.env.S3_PUBLIC_URL).protocol.replace(':', '') as
                | 'http'
                | 'https',
            },
          ]
        : []),
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
  turbopack: {
    root: path.resolve(dirname),
  },
}

const payloadConfig = withPayload(nextConfig, { devBundleServerPackages: false })

// `withPayload` adds `Critical-CH: Sec-CH-Prefers-Color-Scheme` to every
// response. Chrome restarts the first navigation to satisfy that critical
// client hint, which Lighthouse records as an avoidable 307 redirect. The
// hint itself is still requested for the Payload admin UI; it simply no
// longer blocks rendering the public site.
const getPayloadHeaders = payloadConfig.headers

payloadConfig.headers = async () => {
  const headers = getPayloadHeaders ? await getPayloadHeaders() : []

  return headers.map((route) => ({
    ...route,
    headers: route.headers.filter(({ key }) => key.toLowerCase() !== 'critical-ch'),
  }))
}

export default payloadConfig
