import type { CSSProperties } from 'react'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { MotionReveal } from '@/components/shared/MotionReveal'

type BackLinkProps = {
  href: string
  label: string
}

export function BackLink({ href, label }: BackLinkProps) {
  const revealWidth = { '--back-link-reveal-width': `${label.length + 2}ch` } as CSSProperties

  return (
    <MotionReveal amount={0.12} duration={0.4} y={10}>
      <Link
        className="group inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-foreground transition-all duration-500 ease-in-out lg:gap-0 lg:p-2.5 lg:hover:gap-1.5 lg:hover:bg-foreground/5"
        href={href}
      >
        <ArrowRight className="size-4 shrink-0 -scale-x-100 transition-transform duration-500 ease-in-out group-hover:-translate-x-1 lg:size-5" />
        <span
          className="inline-block overflow-hidden whitespace-nowrap lg:max-w-0 lg:text-xs lg:opacity-0 lg:transition-[max-width,opacity] lg:duration-500 lg:ease-in-out lg:group-hover:opacity-100 lg:group-hover:max-w-(--back-link-reveal-width)"
          style={revealWidth}
        >
          {label}
        </span>
      </Link>
    </MotionReveal>
  )
}
