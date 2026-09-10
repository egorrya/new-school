'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'

import { cn } from '@/shared/lib/cn'

type LatestNewsLinkProps = {
  slug: string
  title: string
  textAlign?: 'left' | 'center'
}

export function LatestNewsLink({ slug, title, textAlign = 'left' }: LatestNewsLinkProps) {
  const titleRef = useRef<HTMLSpanElement>(null)
  const [isTitleMultiLine, setIsTitleMultiLine] = useState(false)

  useLayoutEffect(() => {
    const titleElement = titleRef.current

    if (!titleElement) {
      return
    }

    const measureTitle = () => {
      const lineHeight = Number.parseFloat(window.getComputedStyle(titleElement).lineHeight)
      const isMultiLine = titleElement.getBoundingClientRect().height > lineHeight + 1

      setIsTitleMultiLine((currentValue) =>
        currentValue === isMultiLine ? currentValue : isMultiLine,
      )
    }

    const resizeObserver = new ResizeObserver(measureTitle)

    measureTitle()
    resizeObserver.observe(titleElement)

    return () => resizeObserver.disconnect()
  }, [title])

  return (
    <Link
      aria-label={`Открыть новость: ${title}`}
      className="group relative flex w-full max-w-full items-center gap-1.5 pr-2.5 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 sm:w-fit sm:max-w-xl"
      href={`/news/${slug}`}
    >
      <span className="pointer-events-none relative z-10 size-11 shrink-0 overflow-hidden">
        <Image
          alt=""
          aria-hidden="true"
          className="origin-center object-contain scale-[2] translate-y-1.5 brightness-0"
          fill
          loading="eager"
          sizes="2.75rem"
          src="/hero/ornaments/stars.svg"
          unoptimized
        />
      </span>
      <span className={cn('relative z-10 min-w-0', textAlign === 'left' && 'text-left')}>
        <span
          className="block text-pretty text-[calc(var(--text-xs)*0.9)] font-medium leading-[1.5] text-foreground sm:text-xs"
          ref={titleRef}
        >
          {title}
        </span>
      </span>
      <ArrowRight
        aria-hidden="true"
        className={cn(
          'relative z-10 ml-2 size-3.5 shrink-0 text-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none',
          isTitleMultiLine && 'pointer-events-none invisible',
        )}
      />
    </Link>
  )
}
