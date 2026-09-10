import type { ReactNode } from 'react'

import type { VariantProps } from 'class-variance-authority'

import { Card, CardContent, type cardVariants } from '@/shared/ui/primitives/card'
import { cn } from '@/shared/lib/cn'

export function CollectionCardShell({
  children,
  className,
  variant = 'translucent',
}: {
  children: ReactNode
  className?: string
  variant?: VariantProps<typeof cardVariants>['variant']
}) {
  return (
    <Card className={cn('h-full overflow-hidden', className)} variant={variant}>
      <CardContent className="flex h-full flex-col gap-4 p-5 sm:p-6">{children}</CardContent>
    </Card>
  )
}
