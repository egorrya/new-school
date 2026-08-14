import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

import type { TextImageBlock as TextImageBlockType } from '@/payload-types'

import { Button } from '@/components/ui/button'
import { MediaFrame } from '@/components/shared/MediaFrame'
import { PageBlockContainer, PageBlockSection } from '@/components/shared/PageBlock'
import { MotionReveal } from '@/components/shared/MotionReveal'
import { ScrollTextReveal } from '@/components/shared/ScrollTextReveal'

import { cn } from '@/utilities/ui'

export function TextImageBlock({
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

  return (
    <PageBlockSection>
      <PageBlockContainer container={!insideTabs}>
        <MotionReveal amount={0.12} duration={0.47} y={18}>
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
            <div
              className={cn(
                'flex flex-col justify-center gap-6 p-6 sm:p-8 lg:p-10',
                isImageLeft && 'lg:order-2',
              )}
            >
              <div className="space-y-3">
                {eyebrow ? (
                  <p className="font-heading text-sm uppercase tracking-wide text-main sm:text-base">
                    {eyebrow}
                  </p>
                ) : null}
                {insideTabs ? null : (
                  <h2 className="max-w-4xl font-heading text-2xl leading-[1.1] sm:text-3xl lg:text-4xl">
                    {title}
                  </h2>
                )}
                <p className="max-w-3xl text-base leading-relaxed text-foreground/80 sm:text-lg">
                  {text || 'Основной текст этого блока пока не добавлен.'}
                </p>
              </div>

              {checklistItems.length > 0 ? (
                <ul className="space-y-2.5">
                  {checklistItems.map((item, index) => (
                    <li
                      className="flex items-start gap-2.5 text-base leading-snug text-foreground sm:text-lg"
                      key={item.id || `${item.text}-${index}`}
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 size-5 shrink-0 text-main"
                      />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {hasButton ? (
                <Button asChild className="w-fit">
                  <Link href={buttonLink || '/'}>{buttonLabel}</Link>
                </Button>
              ) : null}
            </div>

            <MediaFrame
              alt={title}
              aspectClassName="aspect-[4/3] min-h-[20rem] lg:aspect-auto lg:min-h-[28rem]"
              className={cn(isImageLeft && 'lg:order-1')}
              priority
              resource={image ?? null}
            />
          </div>
        </MotionReveal>

        {closingText ? (
          <ScrollTextReveal
            className="mx-auto max-w-5xl py-16 text-justify [text-align-last:justify] font-heading text-xl leading-[1.45] font-normal sm:py-20 sm:text-2xl lg:py-28 lg:text-3xl"
            text={closingText}
          />
        ) : null}
      </PageBlockContainer>
    </PageBlockSection>
  )
}
