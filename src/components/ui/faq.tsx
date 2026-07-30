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
  question: string
  answer: string
}

type FaqProps = {
  items: FaqItem[]
  className?: string
}

export function Faq({ items, className }: FaqProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <Accordion className={cn('flex flex-col gap-4', className)} collapsible type="single">
      {items.map((item, index) => (
        <MotionReveal
          amount={0.35}

          delay={index * 0.08}
          duration={0.47}
          key={item.id || `${item.question}-${index}`}
          margin="0px 0px -15% 0px"
          y={16}
        >
          <AccordionItem value={item.id || `faq-item-${index}`}>
            <AccordionTrigger className="bg-background text-foreground">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <p className="whitespace-pre-line text-foreground/80">{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        </MotionReveal>
      ))}
    </Accordion>
  )
}
