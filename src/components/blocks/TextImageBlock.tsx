import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

import type { TextImageBlock as TextImageBlockType } from '@/payload-types'

import { Button } from '@/components/ui/button'
import { MediaFrame } from '@/components/shared/MediaFrame'
import { PageBlockContainer, PageBlockSection } from '@/components/shared/PageBlock'
import { MotionReveal } from '@/components/shared/MotionReveal'
import { ScrollTextReveal } from '@/components/shared/ScrollTextReveal'

import { cn } from '@/utilities/ui'

const STAGGER_STEP = 0.09

export async function TextImageBlock({
  eyebrow,
  title,
  text,
  items,
  closingText,
  image,
  buttonLabel,
  buttonLink,
  imagePosition,
  insideTabs,
}: TextImageBlockType & { insideTabs?: boolean }) {
  const isImageLeft = imagePosition === 'left'
  const checklistItems = items ?? []
  const hasButton = Boolean(buttonLabel && buttonLink)

  let step = 0
  const nextDelay = () => step++ * STAGGER_STEP

  return (
    <PageBlockSection className="py-14 sm:py-20 lg:py-12">
      <PageBlockContainer container={!insideTabs}>
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
          <div
            className={cn(
              'flex flex-col justify-center gap-6 p-6 sm:p-8 lg:p-10',
              isImageLeft && 'lg:order-2',
            )}
          >
            <div className="space-y-3">
              {eyebrow ? (
                <MotionReveal delay={nextDelay()} duration={0.4} y={14}>
                  <p className="font-heading text-sm uppercase tracking-wide text-main sm:text-base">
                    {eyebrow}
                  </p>
                </MotionReveal>
              ) : null}
              {insideTabs ? null : (
                <MotionReveal delay={nextDelay()} duration={0.47} y={18}>
                  <h2 className="max-w-4xl font-heading text-2xl leading-[1.1] sm:text-3xl lg:text-4xl">
                    {title}
                  </h2>
                </MotionReveal>
              )}
              <MotionReveal delay={nextDelay()} duration={0.45} y={16}>
                <p className="max-w-3xl text-base leading-relaxed text-foreground/80 sm:text-lg">
                  {text || 'Основной текст этого блока пока не добавлен.'}
                </p>
              </MotionReveal>
            </div>

            {checklistItems.length > 0 ? (
              <ul className="space-y-2.5">
                {checklistItems.map((item, index) => (
                  <MotionReveal
                    amount={0.4}
                    delay={nextDelay()}
                    duration={0.4}
                    key={item.id || `${item.text}-${index}`}
                    y={14}
                  >
                    <li className="flex items-start gap-2.5 text-base leading-relaxed text-foreground/80 sm:text-lg">
                      <CheckCircle2
                        aria-hidden="true"
                        className="size-5 shrink-0 text-main"
                      />
                      <span>{item.text}</span>
                    </li>
                  </MotionReveal>
                ))}
              </ul>
            ) : null}

            {hasButton ? (
              <MotionReveal delay={nextDelay()} duration={0.4} y={12}>
                <Button asChild className="w-fit">
                  <Link href={buttonLink || '/'}>{buttonLabel}</Link>
                </Button>
              </MotionReveal>
            ) : null}
          </div>

          <MotionReveal
            className={cn('min-w-0', isImageLeft && 'lg:order-1')}
            delay={nextDelay()}
            duration={0.5}
            y={22}
          >
            <MediaFrame
              alt={title}
              aspectClassName="aspect-[4/3] min-h-[20rem] lg:aspect-auto lg:min-h-[28rem]"
              priority
              resource={image ?? null}
            />
          </MotionReveal>
        </div>

        {closingText ? (
          <ScrollTextReveal
            className="mx-auto max-w-3xl py-10 text-base text-foreground/80 sm:py-12 sm:text-lg"
            text={closingText}
          />
        ) : null}
      </PageBlockContainer>
    </PageBlockSection>
  )
}
