import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import * as React from "react"

import { cn } from "@/shared/lib/cn"

const buttonShadow =
  "shadow-[0.05rem_0.05rem_0_0_var(--school-black)] sm:shadow-[0.1rem_0.1rem_0_0_var(--school-black)]"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full text-[0.8125rem] font-medium leading-none ring-offset-background transition-all gap-2 sm:text-sm [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          `text-foreground bg-white border border-border ${buttonShadow} hover:translate-x-[0.05rem] hover:translate-y-[0.05rem] hover:shadow-none sm:hover:translate-x-[0.1rem] sm:hover:translate-y-[0.1rem]`,
        noShadow: "text-main-foreground bg-main border border-border",
        neutral:
          `bg-secondary-background text-foreground border border-border ${buttonShadow} hover:translate-x-[0.05rem] hover:translate-y-[0.05rem] hover:shadow-none sm:hover:translate-x-[0.1rem] sm:hover:translate-y-[0.1rem]`,
        reverse:
          `bg-foreground text-background border border-border ${buttonShadow} hover:translate-x-[-0.05rem] hover:translate-y-[-0.05rem] hover:shadow-none sm:hover:translate-x-[-0.1rem] sm:hover:translate-y-[-0.1rem]`,
        outline:
          "bg-transparent text-foreground border border-foreground underline underline-offset-4 decoration-1 hover:bg-foreground hover:text-background",
        link: "relative bg-transparent text-foreground after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:after:scale-x-100 focus-visible:after:scale-x-100",
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
