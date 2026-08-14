import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Медиафайл',
    plural: 'Медиа',
  },
  folders: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Система',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Описание изображения',
      admin: {
        description: 'Коротко опишите, что изображено.',
      },
    },
    {
      name: 'caption',
      type: 'richText',
      label: 'Подпись к изображению',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    // Cap and compress the original file itself — the frontend renders it through
    // Next/Image's on-demand optimizer (see ImageMedia), so we don't need Payload
    // to also generate small/medium/large/xlarge variants for it.
    resizeOptions: {
      width: 2560,
      withoutEnlargement: true,
    },
    formatOptions: {
      format: 'webp',
      options: { quality: 80 },
    },
    // Keep only the sizes actually referenced in code: `thumbnail` for the admin
    // list view, `square` as the testimonial avatar fallback, `og` for social
    // share meta images (see generateMeta.ts / testimonials.ts).
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        formatOptions: { format: 'webp', options: { quality: 70 } },
      },
      {
        name: 'square',
        width: 500,
        height: 500,
        formatOptions: { format: 'webp', options: { quality: 75 } },
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
        // JPEG for maximum compatibility with social-share crawlers that
        // don't reliably render webp OG images.
        formatOptions: { format: 'jpeg', options: { quality: 82 } },
      },
    ],
  },
}
