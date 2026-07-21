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

import { MediaFrame } from '@/components/shared/MediaFrame'
import {
  PageBlockContainer,
  PageBlockEmptyState,
  PageBlockHeader,
  PageBlockSection,
} from '@/components/shared/PageBlock'

const featureIconMap: Record<string, LucideIcon> = {
  'book-open': BookOpen,
  'brain-circuit': BrainCircuit,
  'calendar-days': CalendarDays,
  'graduation-cap': GraduationCap,
  'heart-handshake': HeartHandshake,
  layers: Layers3,
  'lightbulb': Lightbulb,
  rocket: Rocket,
  'shield-check': ShieldCheck,
  sparkles: Sparkles,
  users: Users,
}

function normalizeIconName(iconName: string) {
  return iconName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function FeatureIcon({ iconName }: { iconName?: string | null }) {
  const normalizedName = iconName ? normalizeIconName(iconName) : ''
  const Icon = (normalizedName ? featureIconMap[normalizedName] : undefined) ?? Sparkles

  return (
    <div className="flex size-28 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background text-main-foreground shadow-shadow sm:size-32">
      <Icon className="size-11 sm:size-12" />
    </div>
  )
}

export function FeatureCardsBlock({
  title,
  description,
  cards,
}: FeatureCardsBlockType) {
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
            titleClassName="w-full text-3xl sm:text-4xl lg:text-5xl"
          />

          {featureCards.length > 0 ? (
            <div className="grid justify-items-center gap-x-8 gap-y-12 [grid-template-columns:repeat(auto-fit,minmax(min(100%,20rem),1fr))]">
              {featureCards.map((card, index) => (
                <article
                  className="flex h-full w-full max-w-sm flex-col items-center text-center"
                  key={card.id || `${card.title}-${index}`}
                >
                  {card.iconName ? (
                    <FeatureIcon iconName={card.iconName} />
                  ) : (
                    <div className="flex size-28 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background text-main-foreground shadow-shadow sm:size-32">
                      <Sparkles className="size-11 sm:size-12" />
                    </div>
                  )}

                  <div className="mt-6 space-y-3">
                    <h3 className="mx-auto max-w-sm font-heading text-xl leading-tight sm:text-2xl">
                      {card.title}
                    </h3>
                    <p className="mx-auto max-w-sm text-sm leading-relaxed text-foreground/80">
                      {card.text || 'Описание этого пункта пока не добавлено.'}
                    </p>
                  </div>

                  {card.image ? (
                    <MediaFrame
                      alt={card.title}
                      aspectClassName="aspect-[4/3]"
                      className="mt-6 w-full"
                      resource={card.image}
                    />
                  ) : null}
                </article>
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
