import type { Review } from '@/payload-types'

import { CollectionCardShell } from '@/shared/components/CollectionCardShell'
import { cn } from '@/shared/lib/cn'
import { getTestimonialQuoteClass } from '@/features/reviews/lib/testimonials'

export function ReviewCard({ review }: { review: Review }) {
  return (
    <CollectionCardShell variant="default">
      <p className="font-heading text-5xl leading-none text-main-foreground">“</p>
      <blockquote className={cn('text-foreground', getTestimonialQuoteClass(review.text))}>
        {review.text}
      </blockquote>
      <div className="mt-auto border-t border-border pt-4">
        <p className="max-w-full whitespace-nowrap overflow-hidden text-clip font-heading text-xl leading-[1.1]">
          {review.authorName}
        </p>
        <p className="text-sm leading-relaxed text-foreground/70">
          {review.authorDescription || 'Автор отзыва'}
        </p>
      </div>
    </CollectionCardShell>
  )
}
