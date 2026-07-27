import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import { ru, ruTranslations } from '@payloadcms/translations/languages/ru'

import { Clubs } from './collections/Clubs'
import { FormSubmissions } from './collections/FormSubmissions'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { Pages } from './collections/Pages'
import { GalleryAlbums } from './collections/GalleryAlbums'
import { Jobs } from './collections/Jobs'
import { OrgInfoSections } from './collections/OrgInfoSections'
import { Reviews } from './collections/Reviews'
import { Teachers } from './collections/Teachers'
import { Users } from './collections/Users'
import { Footer } from './globals/Footer/config'
import { Header } from './globals/Header/config'
import { SiteSettings } from './globals/SiteSettings/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import deepMerge from '@/utilities/deepMerge'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    dateFormat: "d MMMM yyyy 'г.,' HH:mm",
    suppressHydrationWarning: true,
    components: {
      header: ['@/components/admin/ForceRussianLanguage'],
      beforeLogin: ['@/components/admin/ForceRussianLanguage'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
  },
  i18n: {
    fallbackLanguage: 'ru',
    supportedLanguages: {
      ru,
    },
    translations: {
      ru: deepMerge(ruTranslations, {
        authentication: {
          emailOrUsername: 'Электронная почта или имя пользователя',
        },
        'plugin-redirects': {
          customUrl: 'Произвольный URL',
          documentToRedirect: 'Документ для перенаправления',
          fromUrl: 'URL источника',
          internalLink: 'Внутренняя ссылка',
          redirectType: 'Тип перенаправления',
          toUrlType: 'Тип URL назначения',
        },
        general: {
          clear: 'Очистить',
          custom: 'Пользовательский',
          deletedAt: 'Дата удаления',
          email: 'Электронная почта',
          emailAddress: 'Электронная почта',
          false: 'Нет',
          item: 'Запись',
          items: 'Записи',
          moving: 'Перемещение',
          trash: 'Корзина',
          true: 'Да',
          updatedSuccessfully: 'Успешно обновлено.',
        },
        validation: {
          emailAddress: 'Пожалуйста, введите корректный адрес электронной почты.',
        },
      }),
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  collections: [
    Pages,
    Clubs,
    News,
    Teachers,
    Reviews,
    Jobs,
    OrgInfoSections,
    GalleryAlbums,
    FormSubmissions,
    Media,
    Users,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [SiteSettings, Header, Footer],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
