'use client'

import { motion, useReducedMotion, type Variants } from 'motion/react'
import type { CSSProperties } from 'react'

import { cn } from '@/utilities/ui'

type FeatureLine = {
  className: string
  direction: 'horizontal' | 'vertical'
  key: string
  lineIndex: number
  style: CSSProperties
}

const featureLineClassName = 'absolute bg-black/80'

const lineVariants: Variants = {
  hidden: ({ direction }: FeatureLine) =>
    direction === 'horizontal' ? { scaleX: 0, scaleY: 1 } : { scaleX: 1, scaleY: 0 },
  visible: ({ lineIndex }: FeatureLine) => ({
    scaleX: 1,
    scaleY: 1,
    transition: {
      delay: 0.16 + lineIndex * 0.08,
      duration: 0.64,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

function FeatureLineSpan({ line }: { line: FeatureLine }) {
  return (
    <motion.span
      aria-hidden="true"
      className={cn(
        featureLineClassName,
        line.direction === 'horizontal'
          ? 'left-0 h-px w-full origin-left'
          : 'top-0 h-full w-px origin-top',
        line.className,
      )}
      custom={line}
      variants={lineVariants}
      style={line.style}
    />
  )
}

export function FeatureGridLines({ count }: { count: number }) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const mobileRows = count
  const smRows = Math.ceil(count / 2)
  const lgRows = Math.ceil(count / 3)
  const mobileHorizontalCount = Math.max(0, mobileRows - 1)
  const smHorizontalCount = Math.max(0, smRows - 1)
  const lgHorizontalCount = Math.max(0, lgRows - 1)
  const smVerticalIndex = mobileHorizontalCount + smHorizontalCount + lgHorizontalCount + 1
  const lgFirstVerticalIndex = smVerticalIndex + 1
  const lgSecondVerticalIndex = lgFirstVerticalIndex + 1

  const lines: FeatureLine[] = []

  const addHorizontalLines = (rows: number, className: string, indexOffset: number) => {
    Array.from({ length: Math.max(0, rows - 1) }, (_, index) => {
      lines.push({
        className,
        direction: 'horizontal',
        key: `${className}-${index}`,
        lineIndex: indexOffset + index + 1,
        style: {
          top: `${((index + 1) / rows) * 100}%`,
        },
      })
    })
  }

  const addVerticalLine = (
    key: string,
    className: string,
    left: string,
    lineIndex: number,
  ) => {
    lines.push({
      className,
      direction: 'vertical',
      key,
      lineIndex,
      style: { left },
    })
  }

  addHorizontalLines(mobileRows, 'sm:hidden', 0)
  addHorizontalLines(smRows, 'hidden sm:block lg:hidden', mobileHorizontalCount)
  addHorizontalLines(lgRows, 'hidden lg:block', mobileHorizontalCount + smHorizontalCount)

  if (count > 1) {
    addVerticalLine('sm-middle', 'hidden sm:block lg:hidden', '50%', smVerticalIndex)
    addVerticalLine('lg-first', 'hidden lg:block', '33.333333%', lgFirstVerticalIndex)
  }

  if (count > 2) {
    addVerticalLine('lg-second', 'hidden lg:block', '66.666667%', lgSecondVerticalIndex)
  }

  if (shouldReduceMotion) {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {lines.map((line) => (
          <span
            aria-hidden="true"
            className={cn(
              featureLineClassName,
              line.direction === 'horizontal'
                ? 'left-0 h-px w-full origin-left'
                : 'top-0 h-full w-px origin-top',
              line.className,
            )}
            key={line.key}
            style={line.style}
          />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      initial="hidden"
      viewport={{ amount: 0.25, margin: '0px 0px -25% 0px', once: false }}
      whileInView="visible"
    >
      {lines.map((line) => (
        <FeatureLineSpan key={line.key} line={line} />
      ))}
    </motion.div>
  )
}
