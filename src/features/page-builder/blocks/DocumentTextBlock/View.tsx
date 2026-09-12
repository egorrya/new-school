import type { DocumentTextBlock as DocumentTextBlockType } from '@/payload-types'

import RichText from '@/shared/components/RichText'
import { PageBlockContainer, PageBlockSection } from '@/shared/components/PageBlock'

export function DocumentTextBlock({ sections, title }: DocumentTextBlockType) {
  return (
    <PageBlockSection>
      <PageBlockContainer>
        <article className="mx-auto max-w-3xl space-y-8 text-sm leading-relaxed sm:text-base">
          <header className="border-b border-border pb-6">
            <h1 className="font-heading text-3xl leading-[1.1] sm:text-4xl">{title}</h1>
          </header>

          {sections?.map((section) => (
            <section className="space-y-3" key={section.id}>
              <h2 className="font-heading text-xl leading-tight sm:text-2xl">{section.title}</h2>
              <RichText data={section.content} enableGutter={false} enableProse={true} />
            </section>
          ))}
        </article>
      </PageBlockContainer>
    </PageBlockSection>
  )
}
