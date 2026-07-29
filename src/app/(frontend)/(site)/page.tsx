import Page, { generateMetadata as sharedGenerateMetadata } from './[...slug]/page'

export const dynamic = 'force-dynamic'

export const generateMetadata = sharedGenerateMetadata

export default async function HomePage() {
  return Page({ params: Promise.resolve({ slug: ['home'] }) })
}
