import type { MarqueeBlock as MarqueeBlockType } from '@/payload-types'

import Marquee from '@/components/ui/marquee'

export function MarqueeBlock({ items }: MarqueeBlockType) {
  const marqueeItems = (items ?? [])
    .map((item) => item?.text?.trim())
    .filter((item): item is string => Boolean(item))

  if (marqueeItems.length === 0) {
    return null
  }

  return <Marquee items={marqueeItems} />
}
