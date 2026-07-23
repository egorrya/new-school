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

export function FeatureCardsBlock({ title, description, cards }: FeatureCardsBlockType) {
  const featureCards = cards ?? []

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <div className="space-y-8">
          <PageBlockHeader
            description={description || 'Краткое описание преимуществ пока не заполнено.'}
            descriptionClassName="mx-auto w-full max-w-3xl text-center"
            className="mx-auto flex max-w-4xl flex-col items-center text-center"
            title={title}
            titleClassName="w-full text-2xl sm:text-3xl lg:text-4xl"
          />

          {featureCards.length > 0 ? (
            <MotionReveal amount={0.2} duration={0.8} y={18}>
              <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr))]">
                {featureCards.map((card, index) => (
                  <article className="w-full" key={card.id || `${card.title}-${index}`}>
                    <div className="flex items-center gap-6">
                      {card.iconName ? (
                        <FeatureIcon
                          color={featureIconColors[index % featureIconColors.length]}
                          iconName={card.iconName}
                        />
                      ) : (
                        <Card
                          className="flex size-14 shrink-0 items-center justify-center rounded-[0.8rem] border-2 border-border text-white shadow-shadow sm:size-16"
                          style={{
                            backgroundColor: featureIconColors[index % featureIconColors.length],
                          }}
                        >
                          <CardContent className="flex h-full w-full items-center justify-center p-0">
                            <Sparkles className="size-7 sm:size-8" />
                          </CardContent>
                        </Card>
                      )}

                      <div className="min-w-0 text-left">
                        <h3 className="font-heading text-lg leading-[1.1] sm:text-xl">
                          {card.title}
                        </h3>
                      </div>
                    </div>

                    <p className="mt-5 max-w-2xl text-sm leading-relaxed text-foreground/80">
                      {card.text || 'Описание этого пункта пока не добавлено.'}
                    </p>
                  </article>
                ))}
              </div>
            </MotionReveal>
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
