'use client'

import type { SchoolLifeBlock as SchoolLifeBlockType } from '@/payload-types'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'

import { SchoolLifeDivider } from '@/components/blocks/SchoolLifeDivider.client'
import { SchoolLifeMark } from '@/components/blocks/SchoolLifeMark.client'
import { PageBlockContainer, PageBlockSection } from '@/components/shared/PageBlock'

const WORD_REVEAL_DELAY = 0.15
const WORD_REVEAL_DURATION = 0.48
const SEQUENCE_DELAY = 0.15
const DIVIDER_DURATION = 0.82
const MARK_REVEAL_DURATION = 0.42

const hiddenRevealState = { opacity: 0, y: 18 }
const visibleRevealState = { opacity: 1, y: 0 }

export function SchoolLifeBlock({ description, title }: SchoolLifeBlockType) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { amount: 0.15, once: true })
  const titleLines = title.split('\n').map((line) => line.trim().split(/\s+/).filter(Boolean))
  const wordCount = titleLines.reduce((count, words) => count + words.length, 0)
  const headingDuration = Math.max(0, wordCount - 1) * WORD_REVEAL_DELAY + WORD_REVEAL_DURATION
  const dividerDelay = headingDuration + SEQUENCE_DELAY
  const markDelay = dividerDelay + DIVIDER_DURATION + SEQUENCE_DELAY
  const textDelay = markDelay + MARK_REVEAL_DURATION + SEQUENCE_DELAY
  const isVisible = shouldReduceMotion || isInView

  return (
    <PageBlockSection className="py-14 sm:py-20 lg:py-28">
      <div ref={sectionRef}>
        <PageBlockContainer>
          <h2 className="font-heading text-[clamp(2.5rem,4.7vw,4.5rem)] leading-[0.98] tracking-[-0.045em] uppercase text-[var(--school-black)]">
            {titleLines.map((words, lineIndex) => {
              const lineWordOffset = titleLines
                .slice(0, lineIndex)
                .reduce((count, previousWords) => count + previousWords.length, 0)

              return (
                <span className="block" key={`${words.join('-')}-${lineIndex}`}>
                  {words.map((word, wordIndex) => (
                    <motion.span
                      animate={
                        shouldReduceMotion
                          ? undefined
                          : isInView
                            ? visibleRevealState
                            : hiddenRevealState
                      }
                      className="inline-block"
                      initial={shouldReduceMotion ? false : hiddenRevealState}
                      key={`${word}-${wordIndex}`}
                      transition={{
                        delay: (lineWordOffset + wordIndex) * WORD_REVEAL_DELAY,
                        duration: WORD_REVEAL_DURATION,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {word}
                      {wordIndex < words.length - 1 ? '\u00A0' : null}
                    </motion.span>
                  ))}
                </span>
              )
            })}
          </h2>

          <div className="mt-9 sm:mt-12 lg:mt-16">
            <SchoolLifeDivider delay={dividerDelay} isVisible={isVisible} />

            <div className="pt-8 sm:pt-12 lg:pt-16">
              <div className="grid gap-8 sm:gap-10 lg:grid-cols-[minmax(12rem,1fr)_minmax(0,2fr)] lg:gap-16">
                <SchoolLifeMark delay={markDelay} isVisible={isVisible} />

                <motion.p
                  animate={shouldReduceMotion ? undefined : isInView ? visibleRevealState : hiddenRevealState}
                  className="max-w-3xl text-lg leading-relaxed font-light text-[var(--school-black)] sm:text-xl lg:text-2xl"
                  initial={shouldReduceMotion ? false : hiddenRevealState}
                  transition={{
                    delay: textDelay,
                    duration: 0.58,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {description}
                </motion.p>
              </div>
            </div>
          </div>
        </PageBlockContainer>
      </div>
    </PageBlockSection>
  )
}
