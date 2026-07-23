import type { Club } from '@/payload-types'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MediaFrame } from '@/components/shared/MediaFrame'
import { getDocumentHref } from '@/utilities/getDocumentHref'

type ClubCardProps = {
  club: Club
  priority?: boolean
}

export function ClubCard({ club, priority }: ClubCardProps) {
  const href = getDocumentHref('clubs', club.slug)

  return (
    <Card className="h-full overflow-hidden bg-secondary-background/25">
      <CardContent className="flex h-full flex-col gap-4 p-5 sm:p-6">
        <MediaFrame alt={club.title} aspectClassName="aspect-[16/10]" priority={priority} resource={club.coverImage} />

        <div className="space-y-2">
          <h3 className="font-heading text-2xl leading-[1.1]">
            <Link className="transition-colors hover:text-main" href={href}>
              {club.title}
            </Link>
          </h3>
          <p className="text-sm leading-relaxed text-foreground/80">
            {club.shortDescription || 'Краткое описание кружка пока не добавлено.'}
          </p>
        </div>

        <div className="mt-auto pt-2">
          <Button asChild size="sm" variant="neutral">
            <Link href={href}>Подробнее</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
