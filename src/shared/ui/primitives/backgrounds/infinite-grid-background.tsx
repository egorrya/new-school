import { GridSpotlight } from './GridSpotlight.client'
import { cn } from '@/shared/lib/cn'

type InfiniteGridBackgroundProps = {
  className?: string
  cellSize?: number
}

/**
 * The static layer paints immediately. The cursor spotlight is a tiny isolated
 * client component that only listens on devices with a precise hover pointer,
 * avoiding the old always-running Motion animation on mobile.
 */
export function InfiniteGridBackground({
  className,
  cellSize = 40,
}: InfiniteGridBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none sticky top-0 h-screen overflow-hidden bg-background', className)}
    >
      <GridSpotlight cellSize={cellSize} />
    </div>
  )
}
