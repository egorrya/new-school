'use client'

import type { LucideIcon } from 'lucide-react'
import {
  Award,
  Baby,
  BookOpen,
  CalendarDays,
  Clock,
  GraduationCap,
  HeartHandshake,
  Mic,
  Music,
  Palette,
  PenTool,
  Sparkles,
  Star,
  Trophy,
  Users,
  Utensils,
  Wallet,
} from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import Link from 'next/link'
import type { MouseEvent } from 'react'

import type { Club } from '@/payload-types'

import { MotionReveal } from '@/shared/components/MotionReveal'
import { scrollToTabSection } from '@/shared/lib/scrollToTabSection'

type ClubTab = NonNullable<Club['tabs']>[number]

const clubTabIconMap: Record<NonNullable<ClubTab['icon']>, LucideIcon> = {
  award: Award,
  baby: Baby,
  'book-open': BookOpen,
  'calendar-days': CalendarDays,
  clock: Clock,
  'graduation-cap': GraduationCap,
  'heart-handshake': HeartHandshake,
  mic: Mic,
  music: Music,
  palette: Palette,
  'pen-tool': PenTool,
  sparkles: Sparkles,
  star: Star,
  trophy: Trophy,
  users: Users,
  utensils: Utensils,
  wallet: Wallet,
}

const clubTabColors = [
  { background: '#FDEBEA', foreground: '#E1483F' },
  { background: '#E7F0FC', foreground: '#2266B8' },
  { background: '#FEF3D6', foreground: '#D99A00' },
  { background: '#E4F5EC', foreground: '#1E9C67' },
]

export function ClubTabsNavCards({ tabs }: { tabs?: Club['tabs'] }) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const items = tabs ?? []

  if (items.length === 0) {
    return null
  }

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }

    event.preventDefault()
    window.history.pushState(null, '', `#${id}`)
    scrollToTabSection(id, shouldReduceMotion)
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {items.map((tab, index) => {
        const Icon = (tab.icon && clubTabIconMap[tab.icon]) ?? Sparkles
        const color = clubTabColors[index % clubTabColors.length]
        const id = `tab-${index}`

        return (
          <MotionReveal
            amount={0.12}
            className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
            delay={index * 0.08}
            duration={0.42}
            key={tab.id || `${tab.title}-${index}`}
            y={14}
          >
            <Link
              className="flex h-full items-center gap-4 rounded-base border border-border bg-card p-4 transition-colors hover:bg-foreground/[0.03]"
              href={`#${id}`}
              onClick={(event) => handleClick(event, id)}
            >
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: color.background, color: color.foreground }}
              >
                <Icon className="size-5" />
              </div>
              <p className="min-w-0 font-heading text-base leading-tight">{tab.title}</p>
            </Link>
          </MotionReveal>
        )
      })}
    </div>
  )
}
