'use client'

import { Button } from '@/shared/ui/primitives/button'
import { cn } from '@/shared/lib/cn'

type MobileMenuTriggerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileMenuTrigger({ open, onOpenChange }: MobileMenuTriggerProps) {
  return (
    <Button
      aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
      className={cn(
        'relative size-13 border-0 bg-transparent shadow-none hover:translate-x-0 hover:translate-y-0 hover:bg-transparent hover:shadow-none active:bg-transparent sm:shadow-none sm:hover:shadow-none',
        open && 'z-90',
      )}
      onClick={() => onOpenChange(!open)}
      size="icon"
      type="button"
      variant="neutral"
    >
      <span className="relative flex size-5 items-center justify-center" aria-hidden="true">
        <span
          className={cn(
            'absolute left-0 top-[5px] h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ease-out',
            open && 'translate-y-1 rotate-45',
          )}
        />
        <span
          className={cn(
            'absolute left-0 top-[9px] h-0.5 w-5 rounded-full bg-current transition-opacity duration-150 ease-out',
            open && 'opacity-0',
          )}
        />
        <span
          className={cn(
            'absolute left-0 top-[13px] h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ease-out',
            open && '-translate-y-1 -rotate-45',
          )}
        />
      </span>
    </Button>
  )
}
