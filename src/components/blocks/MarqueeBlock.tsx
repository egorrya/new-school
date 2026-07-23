import type { MarqueeBlock as MarqueeBlockType } from '@/payload-types'

import { MarqueeStage } from '@/components/blocks/MarqueeStage.client'
import { PageBlockSection } from '@/components/shared/PageBlock'

export function MarqueeBlock({ items }: MarqueeBlockType) {
  const marqueeItems = (items ?? [])
    .map((item) => item?.text?.trim())
    .filter((item): item is string => Boolean(item))

  if (marqueeItems.length === 0) {
    return null
  }

  return (
    <PageBlockSection className="py-0">
      <MarqueeStage
        className="border-y-2 border-border bg-secondary-background text-foreground font-base"
        items={marqueeItems}
      />
    </PageBlockSection>
  )
}
