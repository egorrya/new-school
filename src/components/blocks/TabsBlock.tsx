import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import type { TabsBlock as TabsBlockType } from '@/payload-types'

import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
} from '@/components/shared/PageBlock'
import RichText from '@/components/shared/RichText'
import { MotionReveal, TabContentMotionProvider } from '@/components/shared/MotionReveal'

import { RenderBlocks } from './RenderBlocks'
import { TabsBlockClient } from './TabsBlock/TabsBlock.client'

type TabsBlockProps = TabsBlockType & {
  pageUrl: string
  clubId?: number | null
  hideNavigation?: boolean | null
}

function hasRichText(data?: DefaultTypedEditorState | null) {
  return Boolean(data?.root?.children?.length)
}

export function TabsBlock({
  title,
  description,
  tabs,
  pageUrl,
  clubId,
  hideNavigation,
}: TabsBlockProps) {
  const tabItems = tabs ?? []
  const tabsNavItems = tabItems.map((tab, index) => ({
    id: `tab-${index}`,
    title: tab.title,
  }))
  const tabPanels = tabItems.map((tab, index) => {
    const nestedBlocks = tab.layout ?? []
    const showRichText = hasRichText(tab.content)
    const tabId = `tab-${index}`

    return (
      <div
        key={tabId}
        id={tabId}
        className="w-full [&_p]:!text-base [&_p]:!leading-relaxed"
        style={{
          scrollMarginTop:
            'calc(var(--site-header-fixed-bottom, var(--site-header-height, 0px)) + var(--site-tabs-nav-height, 0px) + 2rem)',
        }}
      >
        <TabContentMotionProvider>
          <div className="space-y-6">
            <div className="mx-auto max-w-3xl space-y-6">
              <MotionReveal y={14}>
                <h3 className="text-xl font-medium sm:text-2xl">{tab.title}</h3>
              </MotionReveal>

              {showRichText ? (
                <MotionReveal>
                  <RichText
                    data={tab.content as DefaultTypedEditorState}
                    enableGutter={false}
                    enableProse
                  />
                </MotionReveal>
              ) : null}

              {!showRichText && nestedBlocks.length === 0 ? (
                <PageBlockEmptyState
                  description="Добавьте текст или вложенные screens в эту вкладку."
                  title="Вкладка пока пустая"
                />
              ) : null}
            </div>

            {nestedBlocks.length > 0 ? (
              <div className="mx-auto max-w-3xl space-y-6 [&>section]:!py-0">
                <RenderBlocks
                  allowFullScreenHero={false}
                  blocks={nestedBlocks}
                  clubId={clubId}
                  insideTabs
                  pageUrl={pageUrl}
                />
              </div>
            ) : null}
          </div>
        </TabContentMotionProvider>
      </div>
    )
  })

  return (
    <PageBlockSection>
      <div className="space-y-8">
        {title ? (
          <PageBlockContainer>
            <PageBlockHeader
              className="mx-auto max-w-4xl text-center"
              description={description}
              descriptionClassName="mx-auto max-w-3xl text-center"
              title={title}
              titleClassName="text-2xl sm:text-3xl lg:text-4xl"
            />
          </PageBlockContainer>
        ) : null}

        {tabItems.length > 0 ? (
          <TabsBlockClient
            hideNavigation={Boolean(hideNavigation)}
            panelContainerClassName="container"
            tabs={tabsNavItems}
          >
            {tabPanels}
          </TabsBlockClient>
        ) : (
          <PageBlockContainer>
            <PageBlockEmptyState
              description="Добавьте хотя бы одну вкладку, чтобы этот screen появился на сайте."
              title="Вкладки пока не добавлены"
            />
          </PageBlockContainer>
        )}
      </div>
    </PageBlockSection>
  )
}
