import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import type { TabsBlock as TabsBlockType } from '@/payload-types'

import { AnimatedTabs } from '@/components/shadcn-space/tabs/tabs-01'
import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
  PageBlockSurface,
} from '@/components/shared/PageBlock'
import { MotionReveal } from '@/components/shared/MotionReveal'
import RichText from '@/components/shared/RichText'

import { RenderBlocks } from './RenderBlocks'

type TabsBlockProps = TabsBlockType & {
  pageUrl: string
}

function hasRichText(data?: DefaultTypedEditorState | null) {
  return Boolean(data?.root?.children?.length)
}

export function TabsBlock({ title, description, tabs, pageUrl }: TabsBlockProps) {
  const tabItems = tabs ?? []

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <div className="space-y-8">
          {title ? (
            <PageBlockHeader
              className="mx-auto max-w-4xl text-center"
              description={description}
              descriptionClassName="mx-auto max-w-3xl text-center"
              title={title}
              titleClassName="text-2xl sm:text-3xl lg:text-4xl"
            />
          ) : null}

          {tabItems.length > 0 ? (
            <MotionReveal amount={0.35} blur={2} duration={0.47} y={18}>
              <AnimatedTabs
                tabs={tabItems.map((tab, index) => {
                  const nestedBlocks = tab.layout ?? []
                  const showRichText = hasRichText(tab.content)

                  return {
                    title: tab.title,
                    value: tab.id || `${tab.title}-${index}`,
                    content: (
                      <PageBlockSurface className="overflow-hidden bg-background p-5 sm:p-6 lg:p-8">
                        <div className="space-y-8">
                          {showRichText ? (
                            <RichText
                              data={tab.content as DefaultTypedEditorState}
                              enableGutter={false}
                              enableProse
                              className="max-w-3xl"
                            />
                          ) : null}

                          {nestedBlocks.length > 0 ? (
                            <div className="-mx-5 -mb-5 sm:-mx-6 sm:-mb-6 lg:-mx-8 lg:-mb-8">
                              <RenderBlocks
                                allowFullScreenHero={false}
                                blocks={nestedBlocks}
                                pageUrl={pageUrl}
                              />
                            </div>
                          ) : null}

                          {!showRichText && nestedBlocks.length === 0 ? (
                            <PageBlockEmptyState
                              description="Добавьте текст или вложенные screens в эту вкладку."
                              title="Вкладка пока пустая"
                            />
                          ) : null}
                        </div>
                      </PageBlockSurface>
                    ),
                  }
                })}
              />
            </MotionReveal>
          ) : (
            <PageBlockEmptyState
              description="Добавьте хотя бы одну вкладку, чтобы этот screen появился на сайте."
              title="Вкладки пока не добавлены"
            />
          )}
        </div>
      </PageBlockContainer>
    </PageBlockSection>
  )
}
