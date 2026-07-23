"use client"

import type * as React from "react"

import { useMemo, useState } from "react"
import { motion } from "motion/react"

import { cn } from "@/utilities/ui"

export type AnimatedTab = {
  title: string
  value: string
  content?: React.ReactNode
}

type AnimatedTabsProps = {
  tabs: AnimatedTab[]
  containerClassName?: string
  activeTabClassName?: string
  tabClassName?: string
  contentClassName?: string
}

export function AnimatedTabs({
  tabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}: AnimatedTabsProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [hovering, setHovering] = useState(false)

  const safeActiveIdx = tabs[activeIdx] ? activeIdx : 0

  const reorderedTabs = useMemo(
    () => [tabs[safeActiveIdx], ...tabs.filter((_, i) => i !== safeActiveIdx)].filter(Boolean),
    [safeActiveIdx, tabs],
  )

  if (tabs.length === 0) {
    return null
  }

  return (
    <div className="[perspective:1000px] relative flex w-full flex-col items-start justify-start">
      <div
        role="tablist"
        className={cn(
          "relative flex w-full max-w-full flex-row items-center justify-center overflow-auto [perspective:1000px] sm:overflow-visible",
          containerClassName,
        )}
      >
        {tabs.map((tab, idx) => {
          const isActive = idx === safeActiveIdx

          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveIdx(idx)}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              className={cn(
                "relative shrink-0 rounded-full px-8 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                tabClassName,
              )}
              style={{ transformStyle: "preserve-3d" }}
            >
              {isActive ? (
                <motion.div
                  layoutId="tabs-active-button"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  className={cn("absolute inset-0 rounded-full bg-primary", activeTabClassName)}
                />
              ) : null}
              <span
                className={cn(
                  "relative block text-sm font-medium",
                  isActive ? "text-background" : "text-foreground",
                )}
              >
                {tab.title}
              </span>
            </button>
          )
        })}
      </div>

      <FadeInStack
        tabs={reorderedTabs}
        hovering={hovering}
        className={cn("mt-10", contentClassName)}
      />
    </div>
  )
}

type FadeInStackProps = {
  className?: string
  tabs: AnimatedTab[]
  hovering?: boolean
}

function FadeInStack({ className, tabs, hovering }: FadeInStackProps) {
  return (
    <div className="grid w-full">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          style={{
            scale: Math.max(1 - idx * 0.04, 0.9),
            y: hovering ? idx * -12 : 0,
            zIndex: tabs.length - idx,
            opacity: idx < 3 ? 1 - idx * 0.12 : 0,
            pointerEvents: idx === 0 ? "auto" : "none",
          }}
          animate={{
            y: idx === 0 ? [0, 18, 0] : hovering ? idx * -12 : 0,
          }}
          className={cn("col-start-1 row-start-1 w-full", className)}
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  )
}

export default AnimatedTabs
