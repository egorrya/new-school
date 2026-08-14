'use client'

import { LayoutGroup, motion } from 'motion/react'
import * as React from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { MotionReveal } from '@/components/shared/MotionReveal'
import { cn } from '@/utilities/ui'

export type FaqItem = {
  id?: string | null
  category?: string | null
  question: string
  answer: string
}

type FaqProps = {
  items: FaqItem[]
  className?: string
}

const ALL_CATEGORY = '__all__'

export function Faq({ items, className }: FaqProps) {
  const categories = React.useMemo(() => {
    const seen = new Map<string, number>()

    for (const item of items) {
      const category = item.category?.trim()

      if (!category) {
        continue
      }

      seen.set(category, (seen.get(category) ?? 0) + 1)
    }

    return Array.from(seen.entries())
  }, [items])

  const hasCategories = categories.length > 1

  const [activeCategory, setActiveCategory] = React.useState(ALL_CATEGORY)

  const visibleItems = React.useMemo(() => {
    if (!hasCategories || activeCategory === ALL_CATEGORY) {
      return items
    }

    return items.filter((item) => item.category?.trim() === activeCategory)
  }, [activeCategory, hasCategories, items])

  if (items.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-6', className)}>
      {hasCategories && (
        <LayoutGroup id="faq-filter">
          <div
            className="grid w-full grid-cols-2 items-stretch gap-1.5 rounded-base border border-foreground bg-background p-1.5 sm:flex sm:gap-1"
            role="tablist"
          >
            <MotionReveal amount={0.4} className="min-w-0 sm:flex sm:flex-1" delay={0} duration={0.4} y={10}>
              <FaqFilterPill
                isActive={activeCategory === ALL_CATEGORY}
                label={`Все (${items.length})`}
                onClick={() => setActiveCategory(ALL_CATEGORY)}
              />
            </MotionReveal>

            {categories.map(([category, count], index) => (
              <MotionReveal
                amount={0.4}
                className="min-w-0 sm:flex sm:flex-1"
                delay={(index + 1) * 0.06}
                duration={0.4}
                key={category}
                y={10}
              >
                <FaqFilterPill
                  isActive={activeCategory === category}
                  label={`${category} (${count})`}
                  onClick={() => setActiveCategory(category)}
                />
              </MotionReveal>
            ))}
          </div>
        </LayoutGroup>
      )}

      <Accordion className="flex flex-col gap-4" collapsible key={activeCategory} type="single">
        {visibleItems.map((item, index) => (
          <MotionReveal
            amount={0.12}
            delay={index * 0.08}
            duration={0.47}
            key={item.id || `${item.question}-${index}`}
            margin="0px 0px -15% 0px"
            y={16}
          >
            <AccordionItem value={item.id || `faq-item-${index}`}>
              <AccordionTrigger className="bg-background text-base text-foreground sm:text-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/80 sm:text-base">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          </MotionReveal>
        ))}
      </Accordion>
    </div>
  )
}

function FaqFilterPill({
  isActive,
  label,
  onClick,
}: {
  isActive: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      aria-selected={isActive}
      className={cn(
        'relative flex w-full min-w-0 cursor-pointer items-center justify-center rounded-base px-2 py-4 text-center text-xs leading-tight font-medium text-balance transition-colors duration-300 ease-out sm:flex-1 sm:px-4 sm:text-sm',
        isActive ? 'text-white' : 'text-foreground',
      )}
      onClick={onClick}
      role="tab"
      type="button"
    >
      {isActive ? (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-base bg-foreground"
          layoutId="faq-filter-active-pill"
          transition={{ type: 'spring', stiffness: 520, damping: 38, mass: 0.75 }}
        />
      ) : null}
      <span className="relative z-10 min-w-0 wrap-break-word tracking-[0.02em]">{label}</span>
    </button>
  )
}
