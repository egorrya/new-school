import Page, { generateMetadata as sharedGenerateMetadata } from '@/features/pages/screens/CmsPage'


export const generateMetadata = sharedGenerateMetadata

export default async function HomePage() {
  return Page({ params: Promise.resolve({ slug: ['home'] }) })
}
