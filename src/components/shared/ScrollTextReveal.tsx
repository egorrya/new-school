'use client'

import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'

import { cn } from '@/utilities/ui'

type ScrollTextRevealProps = {
  text: string
  className?: string
}

export function ScrollTextReveal({ text, className }: ScrollTextRevealProps) {
  const targetRef = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start 0.7', 'end 0.5'],
  })

  const words = text.split(' ')

  return (
    <p ref={targetRef} className={cn(className)}>
      {words.map((word, index) => {
        const start = index / words.length
        const end = start + 1 / words.length

        return (
          <Word key={`${word}-${index}`} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        )
      })}
    </p>
  )
}

function Word({
  children,
  progress,
  range,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.08, 1])

  return (
    <motion.span className="text-foreground" style={{ opacity }}>
      {children}{' '}
    </motion.span>
  )
}
