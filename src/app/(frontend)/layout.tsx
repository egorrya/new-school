import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Montserrat } from 'next/font/google'
import React from 'react'

import { Footer } from '@/components/layout/Footer/Component'
import { Header } from '@/components/layout/Header/Component'
import { Toaster } from '@/components/ui/sonner'
import { InfiniteGridBackground } from '@/components/ui/backgrounds/infinite-grid-background'
import { mergeOpenGraph } from '@/lib/mergeOpenGraph'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
  weight: ['400', '500', '800'],
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={cn(montserrat.variable)} lang="ru" suppressHydrationWarning>
      <head>
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="relative isolate bg-background" suppressHydrationWarning>
        <Header />
        <main
          className="relative z-10 flex-1 border-b-2 border-border bg-background"
          style={{ minHeight: '100dvh' }}
        >
          <InfiniteGridBackground />
          <div
            className="relative"
            style={{ paddingTop: 'var(--site-header-height)', marginTop: '-100vh' }}
          >
            {children}
          </div>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
}
