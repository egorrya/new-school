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
} from 'lucide-react'

import type { Club } from '@/payload-types'

import { MotionReveal } from '@/components/shared/MotionReveal'

type ClubInfoCard = NonNullable<Club['infoCards']>[number]

const clubInfoCardIconMap: Record<ClubInfoCard['icon'], LucideIcon> = {
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
}

const clubInfoCardColors = [
  { background: '#FDEBEA', foreground: '#E1483F' },
  { background: '#E7F0FC', foreground: '#2266B8' },
  { background: '#FEF3D6', foreground: '#D99A00' },
  { background: '#E4F5EC', foreground: '#1E9C67' },
]

export function ClubInfoCards({ cards }: { cards?: Club['infoCards'] }) {
  const items = cards ?? []

  if (items.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {items.map((card, index) => {
        const Icon = clubInfoCardIconMap[card.icon] ?? Sparkles
        const color = clubInfoCardColors[index % clubInfoCardColors.length]

        return (
          <MotionReveal
            amount={0.35}

            className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
            delay={index * 0.08}
            duration={0.42}
            key={card.id || `${card.title}-${index}`}
            y={14}
          >
            <article className="flex h-full items-center gap-4 rounded-base border border-border bg-card p-4">
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: color.background, color: color.foreground }}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="font-heading text-base leading-tight">{card.title}</p>
                <p className="text-sm leading-snug text-foreground/60">{card.description}</p>
              </div>
            </article>
          </MotionReveal>
        )
      })}
    </div>
  )
}
