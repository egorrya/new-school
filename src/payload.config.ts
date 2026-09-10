import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import { ru, ruTranslations } from '@payloadcms/translations/languages/ru'

import { Clubs } from './cms/collections/Clubs'
import { FormSubmissions } from './cms/collections/FormSubmissions'
import { Media } from './cms/collections/Media'
import { News } from './cms/collections/News'
import { Pages } from './cms/collections/Pages'
import { GalleryAlbums } from './cms/collections/GalleryAlbums'
import { Jobs } from './cms/collections/Jobs'
import { OrgInfoSections } from './cms/collections/OrgInfoSections'
import { ProgramCategories } from './cms/collections/ProgramCategories'
import { Reviews } from './cms/collections/Reviews'
import { Teachers } from './cms/collections/Teachers'
import { Users } from './cms/collections/Users'
import { Footer } from './cms/globals/Footer/config'
import { Header } from './cms/globals/Header/config'
import { SiteSettings } from './cms/globals/SiteSettings/config'
import { plugins } from './cms/plugins'
import { defaultLexical } from '@/cms/fields/defaultLexical'
import { migrations } from './cms/migrations'
import deepMerge from '@/shared/lib/deepMerge'
import { getServerSideURL } from '@/shared/lib/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    dateFormat: "d MMMM yyyy 'г.,' HH:mm",
    suppressHydrationWarning: true,
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
    // This project may connect to the production database during local development.
    // Apply schema changes only through reviewed migrations, never via dev schema push.
    push: false,
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    prodMigrations: migrations,
  }),
  collections: [
    Pages,
    Clubs,
    ProgramCategories,
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
  serverURL: getServerSideURL(),
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
