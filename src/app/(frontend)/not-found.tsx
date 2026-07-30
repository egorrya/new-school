'use client'

import Link from 'next/link'
import React from 'react'
import { motion, useReducedMotion, type Variants } from 'motion/react'

import { Button } from '@/components/ui/button'
import { MotionReveal } from '@/components/shared/MotionReveal'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

const digits = ['4', '0', '4']

const rowVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const digitVariants: Variants = {
  hidden: { opacity: 0, y: -60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT },
  },
}

export default function NotFound() {
  const shouldReduceMotion = useReducedMotion() ?? false

  return (
    <div
      className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden"
      style={{
        marginTop:
          'calc(-1 * (var(--site-header-height, 0px) + var(--site-secondary-header-height, 0px)))',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
      >
        <motion.span
          className="font-heading cursor-default leading-none text-foreground"
          style={{ fontSize: 'clamp(8rem, 34vw, 28rem)' }}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'visible'}
          variants={shouldReduceMotion ? undefined : rowVariants}
        >
          {digits.map((char, index) => (
            <motion.span
              key={index}
              className="inline-block"
              variants={shouldReduceMotion ? undefined : digitVariants}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,transparent_18%,white_58%,white_100%)]" />
      </div>

      <div className="container relative z-10 flex justify-center px-4">
        <MotionReveal amount={0.3} duration={0.6} y={18}>
          <div className="flex flex-col items-center gap-6 text-center">
            <h1 className="text-3xl font-heading sm:text-4xl">Страница не найдена</h1>
            <Button asChild variant="default">
              <Link href="/">На главную</Link>
            </Button>
          </div>
        </MotionReveal>
      </div>
    </div>
  )
}
