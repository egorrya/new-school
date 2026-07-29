import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import * as React from "react"

import { cn } from "@/utilities/ui"

const buttonShadow = "shadow-[0.125rem_0.125rem_0_0_#222] sm:shadow-[0.25rem_0.25rem_0_0_#222]"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full text-sm font-medium leading-none ring-offset-background transition-all gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          `text-foreground bg-white border-2 border-border ${buttonShadow} hover:translate-x-[0.125rem] hover:translate-y-[0.125rem] hover:shadow-none sm:hover:translate-x-[0.25rem] sm:hover:translate-y-[0.25rem]`,
        noShadow: "text-main-foreground bg-main border-2 border-border",
        neutral:
          `bg-secondary-background text-foreground border-2 border-border ${buttonShadow} hover:translate-x-[0.125rem] hover:translate-y-[0.125rem] hover:shadow-none sm:hover:translate-x-[0.25rem] sm:hover:translate-y-[0.25rem]`,
        reverse:
          `bg-foreground text-background border-2 border-border ${buttonShadow} hover:translate-x-[-0.125rem] hover:translate-y-[-0.125rem] hover:shadow-none sm:hover:translate-x-[-0.25rem] sm:hover:translate-y-[-0.25rem]`,
      },
      size: {
        default: "h-11 px-6 sm:h-[3.25rem] sm:px-9",
        sm: "h-9 px-4 sm:h-10 sm:px-6",
        lg: "h-11 px-6 sm:h-[3.25rem] sm:px-9",
        icon: "size-10 sm:size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
