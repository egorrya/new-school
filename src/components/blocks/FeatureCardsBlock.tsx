import type { FeatureCardsBlock as FeatureCardsBlockType } from '@/payload-types'
import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  BrainCircuit,
  CalendarDays,
  GraduationCap,
  HeartHandshake,
  Layers3,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
} from '@/components/shared/PageBlock'
import { MotionReveal } from '@/components/shared/MotionReveal'

const featureIconMap: Record<string, LucideIcon> = {
  'book-open': BookOpen,
  'brain-circuit': BrainCircuit,
  'calendar-days': CalendarDays,
  'graduation-cap': GraduationCap,
  'heart-handshake': HeartHandshake,
  layers: Layers3,
  lightbulb: Lightbulb,
  rocket: Rocket,
  'shield-check': ShieldCheck,
  sparkles: Sparkles,
  users: Users,
}

const featureIconColors = ['#06336f', '#FF6824', '#FF1E24', '#00B590', '#FFCB00']

function normalizeIconName(iconName: string) {
  return iconName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function FeatureIcon({ iconName, color }: { iconName?: string | null; color: string }) {
  const normalizedName = iconName ? normalizeIconName(iconName) : ''
  const Icon = (normalizedName ? featureIconMap[normalizedName] : undefined) ?? Sparkles

  return (
    <Card
      className="flex size-14 shrink-0 items-center justify-center rounded-[0.8rem] border-2 border-border text-white shadow-shadow sm:size-16"
      style={{ backgroundColor: color }}
    >
      <CardContent className="flex h-full w-full items-center justify-center p-0">
        <Icon className="size-7 sm:size-8" />
      </CardContent>
    </Card>
  )
}

function FeatureCard({
  card,
  index,
}: {
  card: { id?: string | null; text: string; iconName?: string | null }
  index: number
}) {
  const color = featureIconColors[index % featureIconColors.length]

  return (
    <MotionReveal
      amount={0.35}
      blur={2}
      delay={index * 0.15}
      duration={0.235}
      margin="0px 0px -25% 0px"
      y={18}
    >
      <article className="flex h-full items-center gap-5 rounded-base border-2 border-border bg-card p-5 sm:gap-6 sm:p-6">
        <div className="shrink-0">
          <FeatureIcon iconName={card.iconName} color={color} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-medium leading-snug text-foreground sm:text-lg">
            {card.text}
          </p>
        </div>
      </article>
    </MotionReveal>
  )
}

export function FeatureCardsBlock({
  title,
  description,
  hideTitle,
  cards,
  insideTabs,
}: FeatureCardsBlockType & { insideTabs?: boolean }) {
  const featureCards = cards ?? []

  return (
    <PageBlockSection>
      <PageBlockContainer container={!insideTabs}>
        <div className="space-y-8">
          {!hideTitle && (
            <PageBlockHeader
              description={description}
              descriptionClassName={insideTabs ? 'w-full max-w-3xl' : 'mx-auto w-full max-w-3xl text-center'}
              className={insideTabs ? undefined : 'mx-auto flex max-w-4xl flex-col items-center text-center'}
              title={insideTabs ? null : title}
              titleClassName="w-full text-2xl sm:text-3xl lg:text-4xl"
            />
          )}

          {featureCards.length > 0 ? (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
              {featureCards.map((card, index) => (
                <FeatureCard key={card.id || `${card.text}-${index}`} card={card} index={index} />
              ))}
            </div>
          ) : (
            <PageBlockEmptyState
              description="Добавьте столько пунктов, сколько нужно, чтобы этот блок начал работать."
              title="Пункты пока не добавлены"
            />
          )}
        </div>
      </PageBlockContainer>
    </PageBlockSection>
  )
}
