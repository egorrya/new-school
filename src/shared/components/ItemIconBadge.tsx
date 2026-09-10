import type { LucideIcon } from 'lucide-react'
import {
  Award,
  Baby,
  BookOpen,
  Calculator,
  CalendarDays,
  CheckCircle,
  Clock,
  Compass,
  FlaskConical,
  Globe,
  GraduationCap,
  HeartHandshake,
  Languages,
  Lightbulb,
  Mic,
  Music,
  Palette,
  PartyPopper,
  PenTool,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Utensils,
  Wallet,
} from 'lucide-react'

import { cn } from '@/shared/lib/cn'

export const itemIconMap: Record<string, LucideIcon> = {
  award: Award,
  baby: Baby,
  'book-open': BookOpen,
  calculator: Calculator,
  'calendar-days': CalendarDays,
  'check-circle': CheckCircle,
  clock: Clock,
  compass: Compass,
  'flask-conical': FlaskConical,
  globe: Globe,
  'graduation-cap': GraduationCap,
  'heart-handshake': HeartHandshake,
  languages: Languages,
  lightbulb: Lightbulb,
  mic: Mic,
  music: Music,
  palette: Palette,
  'party-popper': PartyPopper,
  'pen-tool': PenTool,
  sparkles: Sparkles,
  star: Star,
  target: Target,
  trophy: Trophy,
  users: Users,
  utensils: Utensils,
  wallet: Wallet,
}

type ItemIconBadgeProps = {
  icon?: null | string
  index: number
  className?: string
}

export function ItemIconBadge({ icon, index, className }: ItemIconBadgeProps) {
  const Icon = icon ? itemIconMap[icon] : undefined

  return (
    <div
      className={cn(
        'flex size-12 shrink-0 items-center justify-center rounded-base border border-border bg-main text-lg font-heading text-main-foreground shadow-shadow',
        className,
      )}
    >
      {Icon ? <Icon className="size-6" /> : String(index + 1).padStart(2, '0')}
    </div>
  )
}
