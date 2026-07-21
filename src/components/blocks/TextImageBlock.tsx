import type { TextImageBlock as TextImageBlockType } from '@/payload-types'

import { MediaFrame } from '@/components/shared/MediaFrame'
import { PageBlockContainer, PageBlockSection } from '@/components/shared/PageBlock'

import { cn } from '@/utilities/ui'

export function TextImageBlock({
  title,
  text,
  image,
  imagePosition,
}: TextImageBlockType) {
  const isImageLeft = imagePosition === 'left'

  return (
    <PageBlockSection>
      <PageBlockContainer>
        <div className="grid gap-0 lg:grid-cols-2">
          <div
            className={cn(
              'flex flex-col justify-center gap-6 p-6 sm:p-8 lg:p-10',
              isImageLeft && 'lg:order-2',
            )}
          >
            <div className="space-y-3">
              <h2 className="max-w-4xl font-heading text-3xl leading-[0.95] sm:text-4xl lg:text-5xl">
                {title}
              </h2>
              <p className="max-w-3xl text-base leading-relaxed text-foreground/80 sm:text-lg">
                {text || 'Основной текст этого блока пока не добавлен.'}
              </p>
            </div>
          </div>

          <MediaFrame
            alt={title}
            aspectClassName="aspect-[4/3] min-h-[20rem] lg:aspect-auto lg:min-h-[28rem]"
            className={cn(isImageLeft && 'lg:order-1')}
            priority
            resource={image ?? null}
          />
        </div>
      </PageBlockContainer>
    </PageBlockSection>
  )
}
