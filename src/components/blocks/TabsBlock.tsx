import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import type { TabsBlock as TabsBlockType } from '@/payload-types'

import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
  PageBlockSurface,
} from '@/components/shared/PageBlock'
import RichText from '@/components/shared/RichText'

import { RenderBlocks } from './RenderBlocks'
import { TabsBlockClient } from './TabsBlock/TabsBlock.client'

type TabsBlockProps = TabsBlockType & {
  pageUrl: string
  clubId?: number | null
}

function hasRichText(data?: DefaultTypedEditorState | null) {
  return Boolean(data?.root?.children?.length)
}

export function TabsBlock({ title, description, tabs, pageUrl, clubId }: TabsBlockProps) {
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
      <PageBlockSurface
        key={tabId}
        id={tabId}
        className="overflow-hidden bg-background px-5 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
        style={{
          scrollMarginTop:
            'calc(var(--site-header-fixed-bottom, var(--site-header-height, 0px)) + var(--site-tabs-nav-height, 0px) + 2rem)',
        }}
      >
        <div className="space-y-8">
          <div className="mx-auto max-w-3xl space-y-8">
            <h3 className="text-xl font-semibold sm:text-2xl">{tab.title}</h3>

            {showRichText ? (
              <RichText
                data={tab.content as DefaultTypedEditorState}
                enableGutter={false}
                enableProse
              />
            ) : null}

            {!showRichText && nestedBlocks.length === 0 ? (
              <PageBlockEmptyState
                description="Добавьте текст или вложенные screens в эту вкладку."
                title="Вкладка пока пустая"
              />
            ) : null}
          </div>

          {nestedBlocks.length > 0 ? (
            <div className="mx-auto -mb-7 max-w-3xl [&>section:first-child]:pt-0 sm:-mb-8 lg:-mb-10">
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
      </PageBlockSurface>
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
          <TabsBlockClient panelContainerClassName="container" tabs={tabsNavItems}>
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
