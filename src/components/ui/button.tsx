import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import * as React from "react"

import { cn } from "@/utilities/ui"

const buttonShadow = "shadow-[0.25rem_0.25rem_0_0_#222]"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full text-sm font-medium leading-none ring-offset-background transition-all gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          `text-foreground bg-white border-2 border-border ${buttonShadow} hover:translate-x-[0.25rem] hover:translate-y-[0.25rem] hover:shadow-none`,
        noShadow: "text-main-foreground bg-main border-2 border-border",
        neutral:
          `bg-secondary-background text-foreground border-2 border-border ${buttonShadow} hover:translate-x-[0.25rem] hover:translate-y-[0.25rem] hover:shadow-none`,
        reverse:
          `bg-foreground text-background border-2 border-border ${buttonShadow} hover:translate-x-[-0.25rem] hover:translate-y-[-0.25rem] hover:shadow-none`,
      },
      size: {
        default: "h-[3.25rem] px-9",
        sm: "h-10 px-6",
        lg: "h-[3.25rem] px-9",
        icon: "size-11",
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
