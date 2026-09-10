import type { GalleryAlbum } from '@/payload-types'

import Link from 'next/link'

import { CollectionCardShell } from '@/shared/components/CollectionCardShell'
import { MediaFrame } from '@/shared/components/MediaFrame'
import { Badge } from '@/shared/ui/primitives/badge'
import { Button } from '@/shared/ui/primitives/button'
import { isMediaDocument } from '@/shared/lib/isMediaDocument'

export function GalleryAlbumCard({ album, priority }: { album: GalleryAlbum; priority?: boolean }) {
  const previewImage = album.images?.find(isMediaDocument) ?? null
  const href = `/gallery-albums/${album.id}`

  return (
    <CollectionCardShell>
      <Link aria-label={album.title} className="block" href={href}>
        <MediaFrame
          alt={album.title}
          aspectClassName="aspect-[4/3]"
          priority={priority}
          resource={previewImage}
        />
      </Link>

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <Badge variant="neutral">Альбом</Badge>
          <h3 className="font-heading text-2xl leading-[1.1]">
            <Link className="transition-colors hover:text-main" href={href}>
              {album.title}
            </Link>
          </h3>
        </div>
        <Badge variant="neutral">{album.images?.length ?? 0} фото</Badge>
      </div>

      <p className="text-sm leading-relaxed text-foreground/80">
        {album.description || 'Описание альбома пока не добавлено.'}
      </p>

      <div className="mt-auto pt-2">
        <Button asChild size="sm" variant="neutral">
          <Link href={href}>Открыть альбом</Link>
        </Button>
      </div>
    </CollectionCardShell>
  )
}
