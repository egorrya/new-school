import 'dotenv/config'

import path from 'path'

import { getPayload, type CollectionSlug } from 'payload'

import config from '@payload-config'
import type { Header } from '@/payload-types'
import { type CTAFormType } from '@/utilities/ctaForm'

type SeedMediaInput = {
  key: string
  filename: string
  alt: string
  filePath: string
}

type SeedContext = {
  disableRevalidate: true
}

type SeededPage = {
  id: number
}

const PLACEHOLDER_TEXT = 'Добавьте описание в панели управления.'
const SEED_CONTEXT: SeedContext = {
  disableRevalidate: true,
}

const seedMediaFiles: SeedMediaInput[] = [
  {
    key: 'hero',
    filename: 'blob.webp',
    alt: 'Абстрактный blob для фона',
    filePath: path.resolve(process.cwd(), 'public/seed-media/blob.webp'),
  },
  {
    key: 'banner1',
    filename: 'seed-banner-1.svg',
    alt: 'Абстрактный баннер 1',
    filePath: path.resolve(process.cwd(), 'public/seed-media/seed-banner-1.svg'),
  },
  {
    key: 'banner2',
    filename: 'seed-banner-2.svg',
    alt: 'Абстрактный баннер 2',
    filePath: path.resolve(process.cwd(), 'public/seed-media/seed-banner-2.svg'),
  },
]

function makeHeroBlock({
  title,
  primaryButtonLabel,
  primaryButtonLink,
  secondaryButtonLabel,
  secondaryButtonLink,
  image,
}: {
  title: string
  primaryButtonLabel: string
  primaryButtonLink: string
  secondaryButtonLabel?: string
  secondaryButtonLink?: string
  image?: number | null
  }) {
  return {
    blockType: 'hero',
    title,
    description: PLACEHOLDER_TEXT,
    image: image ?? null,
    primaryButtonLabel,
    primaryButtonLink,
    secondaryButtonLabel: secondaryButtonLabel ?? null,
    secondaryButtonLink: secondaryButtonLink ?? null,
  }
}

function makeMarqueeBlock(items: string[]) {
  return {
    blockType: 'marquee',
    items: items.map((item) => ({
      text: item,
    })),
  }
}

function makeTextImageBlock(
  title: string,
  imagePosition: 'left' | 'right',
  image?: number | null,
) {
  return {
    blockType: 'textImage',
    title,
    text: PLACEHOLDER_TEXT,
    image: image ?? null,
    imagePosition,
  }
}

function makeProgramBlock(title: string, itemTitles: string[]) {
  return {
    blockType: 'program',
    title,
    description: PLACEHOLDER_TEXT,
    items: itemTitles.map((itemTitle) => ({
      title: itemTitle,
      text: PLACEHOLDER_TEXT,
    })),
  }
}

function makeAudienceBlock(title: string, itemTitles: string[]) {
  return {
    blockType: 'audience',
    title,
    text: PLACEHOLDER_TEXT,
    items: itemTitles.map((itemTitle) => ({
      title: itemTitle,
      text: PLACEHOLDER_TEXT,
    })),
  }
}

function makeScheduleBlock(title: string, labels: string[]) {
  return {
    blockType: 'schedule',
    title,
    description: PLACEHOLDER_TEXT,
    scheduleItems: labels.map((label) => ({
      label,
      value: PLACEHOLDER_TEXT,
    })),
  }
}

function makeFeatureCardsBlock(title: string, cardTitles: string[]) {
  const icons = ['book-open', 'users', 'sparkles']

  return {
    blockType: 'featureCards',
    title,
    description: PLACEHOLDER_TEXT,
    cards: cardTitles.map((cardTitle, index) => ({
      title: cardTitle,
      text: PLACEHOLDER_TEXT,
      iconName: icons[index % icons.length],
      image: null,
    })),
  }
}

function makeCollectionGridBlock(
  title: string,
  collectionType: 'clubs' | 'news' | 'teachers' | 'reviews' | 'jobs' | 'galleryAlbums',
  itemLimit: number,
) {
  return {
    blockType: 'collectionGrid',
    title,
    description: PLACEHOLDER_TEXT,
    collectionType,
    itemLimit,
  }
}

function makeCtaFormBlock(title = 'Оставить заявку', formType: CTAFormType = 'application') {
  return {
    blockType: 'ctaForm',
    title,
    description: PLACEHOLDER_TEXT,
    buttonLabel: 'Отправить заявку',
    formType,
  }
}

type NavigationLink = NonNullable<Header['navigationLinks']>[number]

function makePageNavigationLink(label: string, pageId: number): NavigationLink {
  return {
    link: {
      label,
      newTab: false,
      reference: {
        relationTo: 'pages',
        value: pageId,
      },
      type: 'reference',
    },
  }
}

function makeUrlNavigationLink(label: string, url: string): NavigationLink {
  return {
    link: {
      label,
      newTab: false,
      type: 'custom',
      url,
    },
  }
}

async function findOneByField(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: CollectionSlug,
  fieldName: string,
  value: string,
) {
  const result = await payload.find({
    collection,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      [fieldName]: {
        equals: value,
      },
    } as never,
  })

  return result.docs[0] ?? null
}

async function upsertPublishedDoc(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: CollectionSlug,
  fieldName: string,
  fieldValue: string,
  data: Record<string, unknown>,
  options?: {
    draft?: boolean
  },
) {
  const existing = await findOneByField(payload, collection, fieldName, fieldValue)

  if (existing) {
    const updateOptions: Parameters<typeof payload.update>[0] = {
      collection,
      context: SEED_CONTEXT,
      data,
      id: existing.id,
      overrideAccess: true,
    }

    if (options?.draft === false) {
      updateOptions.draft = false
    }

    return payload.update(updateOptions)
  }

  const createOptions: Parameters<typeof payload.create>[0] = {
    collection,
    context: SEED_CONTEXT,
    data,
    overrideAccess: true,
  }

  if (options?.draft === false) {
    createOptions.draft = false
  }

  return payload.create(createOptions)
}

async function upsertUpload(
  payload: Awaited<ReturnType<typeof getPayload>>,
  { filename, alt, filePath }: SeedMediaInput,
) {
  const existing = await findOneByField(payload, 'media', 'filename', filename)

  if (existing) {
    return payload.update({
      collection: 'media',
      context: SEED_CONTEXT,
      data: {
        alt,
      },
      id: existing.id,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection: 'media',
    context: SEED_CONTEXT,
    data: {
      alt,
    },
    filePath,
    overrideAccess: true,
    overwriteExistingFiles: true,
  })
}

async function seedMedia(payload: Awaited<ReturnType<typeof getPayload>>) {
  const seededMedia = await Promise.all(seedMediaFiles.map((media) => upsertUpload(payload, media)))

  return seededMedia.reduce<Record<string, { id: number }>>((accumulator, media, index) => {
    accumulator[seedMediaFiles[index].key] = {
      id: media.id,
    }

    return accumulator
  }, {})
}

async function seedCollections(payload: Awaited<ReturnType<typeof getPayload>>) {
  const collectionSeeds = [
    {
      slug: 'kulinariya',
      generateSlug: false,
      title: 'Кулинария',
      shortDescription: PLACEHOLDER_TEXT,
      isActive: true,
      sortOrder: 1,
    },
    {
      slug: 'rukodelie',
      generateSlug: false,
      title: 'Рукоделие',
      shortDescription: PLACEHOLDER_TEXT,
      isActive: true,
      sortOrder: 2,
    },
    {
      slug: 'hudozhestvennaya-studiya',
      generateSlug: false,
      title: 'Художественная студия',
      shortDescription: PLACEHOLDER_TEXT,
      isActive: true,
      sortOrder: 3,
    },
    {
      slug: 'muzykalno-teatralnaya-studiya',
      generateSlug: false,
      title: 'Музыкально-театральная студия',
      shortDescription: PLACEHOLDER_TEXT,
      isActive: true,
      sortOrder: 4,
    },
    {
      slug: 'krasivoe-pismo',
      generateSlug: false,
      title: 'Красивое письмо',
      shortDescription: PLACEHOLDER_TEXT,
      isActive: true,
      sortOrder: 5,
    },
  ] as const

  for (const club of collectionSeeds) {
    await upsertPublishedDoc(payload, 'clubs', 'slug', club.slug, club as Record<string, unknown>)
  }

  const newsSeeds = [
    {
      slug: 'novost-1',
      generateSlug: false,
      title: 'Новость 1',
      excerpt: PLACEHOLDER_TEXT,
      publishedAt: '2026-06-01T09:00:00.000Z',
    },
    {
      slug: 'novost-2',
      generateSlug: false,
      title: 'Новость 2',
      excerpt: PLACEHOLDER_TEXT,
      publishedAt: '2026-06-08T09:00:00.000Z',
    },
    {
      slug: 'novost-3',
      generateSlug: false,
      title: 'Новость 3',
      excerpt: PLACEHOLDER_TEXT,
      publishedAt: '2026-06-15T09:00:00.000Z',
    },
  ] as const

  for (const news of newsSeeds) {
    await upsertPublishedDoc(payload, 'news', 'slug', news.slug, news as Record<string, unknown>)
  }

  const teacherSeeds = [
    {
      name: 'Преподаватель 1',
      position: PLACEHOLDER_TEXT,
      sortOrder: 1,
    },
    {
      name: 'Преподаватель 2',
      position: PLACEHOLDER_TEXT,
      sortOrder: 2,
    },
    {
      name: 'Преподаватель 3',
      position: PLACEHOLDER_TEXT,
      sortOrder: 3,
    },
  ] as const

  for (const teacher of teacherSeeds) {
    await upsertPublishedDoc(payload, 'teachers', 'name', teacher.name, teacher as Record<string, unknown>)
  }

  const reviewSeeds = [
    {
      authorName: 'Автор 1',
      authorDescription: PLACEHOLDER_TEXT,
      text: PLACEHOLDER_TEXT,
      isPublished: true,
      sortOrder: 1,
    },
    {
      authorName: 'Автор 2',
      authorDescription: PLACEHOLDER_TEXT,
      text: PLACEHOLDER_TEXT,
      isPublished: true,
      sortOrder: 2,
    },
    {
      authorName: 'Автор 3',
      authorDescription: PLACEHOLDER_TEXT,
      text: PLACEHOLDER_TEXT,
      isPublished: true,
      sortOrder: 3,
    },
  ] as const

  for (const review of reviewSeeds) {
    await upsertPublishedDoc(
      payload,
      'reviews',
      'authorName',
      review.authorName,
      review as Record<string, unknown>,
    )
  }

  const jobSeeds = [
    {
      title: 'Вакансия 1',
      shortDescription: PLACEHOLDER_TEXT,
      contactText: PLACEHOLDER_TEXT,
      isActive: true,
    },
    {
      title: 'Вакансия 2',
      shortDescription: PLACEHOLDER_TEXT,
      contactText: PLACEHOLDER_TEXT,
      isActive: true,
    },
  ] as const

  for (const job of jobSeeds) {
    await upsertPublishedDoc(payload, 'jobs', 'title', job.title, job as Record<string, unknown>)
  }

  const gallerySeeds = [
    {
      title: 'Альбом 1',
      description: PLACEHOLDER_TEXT,
      sortOrder: 1,
    },
    {
      title: 'Альбом 2',
      description: PLACEHOLDER_TEXT,
      sortOrder: 2,
    },
  ] as const

  for (const album of gallerySeeds) {
    await upsertPublishedDoc(payload, 'gallery-albums', 'title', album.title, album as Record<string, unknown>)
  }
}

async function seedPages(
  payload: Awaited<ReturnType<typeof getPayload>>,
  media: Record<string, { id: number }>,
) {
  const pages = [
    {
      slug: 'home',
      title: 'Новая школа',
      pageTitle: 'Новая школа',
      layout: [
        makeHeroBlock({
          title: 'Новая школа',
          primaryButtonLabel: 'Семейные классы',
          primaryButtonLink: '/family-classes',
          secondaryButtonLabel: 'Подготовка к школе',
          secondaryButtonLink: '/school-preparation',
          image: media.hero.id,
        }),
        makeMarqueeBlock([
          'Новая школа',
          'Семейные классы',
          'Подготовка к школе',
          'Кружки',
          'Английский язык',
        ]),
        makeTextImageBlock('О школе', 'right', media.hero.id),
        makeFeatureCardsBlock('Преимущества', ['Преимущество 1', 'Преимущество 2', 'Преимущество 3']),
        makeCtaFormBlock(),
      ],
      meta: {
        title: 'Новая школа',
        description: PLACEHOLDER_TEXT,
        image: media.hero.id,
      },
    },
    {
      slug: 'demo',
      title: 'Демо блоков',
      pageTitle: 'Демо блоков',
      layout: [
        makeHeroBlock({
          title: 'Демо блоков',
          primaryButtonLabel: 'К кружкам',
          primaryButtonLink: '/clubs',
          secondaryButtonLabel: 'О школе',
          secondaryButtonLink: '/about',
          image: media.hero.id,
        }),
        makeMarqueeBlock([
          'Бегущая строка',
          'UI marquee',
          'Анимация без пауз',
          'Секция после hero',
          'Демо блока',
        ]),
        makeTextImageBlock('Вводный блок', 'right', media.hero.id),
        makeTextImageBlock('Текст и изображение слева', 'left', media.hero.id),
        makeTextImageBlock('Текст и изображение справа', 'right', media.banner1.id),
        makeFeatureCardsBlock('Карточки преимуществ', ['Быстрый старт', 'Готовые секции', 'Гибкая сборка']),
        makeAudienceBlock('Для кого подходит', ['Редакторы', 'Маркетологи', 'Администраторы']),
        makeProgramBlock('Как собрана страница', ['Hero', 'Slider', 'Text + image', 'Form']),
        makeScheduleBlock('Расписание работы', ['Понедельник', 'Среда', 'Пятница']),
        makeCollectionGridBlock('Кружки', 'clubs', 3),
        makeCollectionGridBlock('Новости', 'news', 3),
        makeCollectionGridBlock('Преподаватели', 'teachers', 3),
        makeCollectionGridBlock('Отзывы', 'reviews', 3),
        makeCollectionGridBlock('Вакансии', 'jobs', 2),
        makeCollectionGridBlock('Галерея', 'galleryAlbums', 2),
        makeCtaFormBlock('Оставить заявку', 'application'),
      ],
      meta: {
        title: 'Демо блоков',
        description: 'Демонстрационная страница со всеми доступными блоками сайта.',
        image: media.hero.id,
      },
    },
    {
      slug: 'family-classes',
      title: 'Семейные классы',
      pageTitle: 'Семейные классы',
      layout: [
        makeHeroBlock({
          title: 'Семейные классы',
          primaryButtonLabel: 'Подготовка к школе',
          primaryButtonLink: '/school-preparation',
          secondaryButtonLabel: 'Школа английского языка',
          secondaryButtonLink: '/english-school',
          image: media.hero.id,
        }),
        makeTextImageBlock('Обучение в семейном формате', 'right', media.hero.id),
        makeTextImageBlock('Начальная школа', 'left', media.hero.id),
        makeTextImageBlock('Средняя школа', 'right', media.hero.id),
        makeTextImageBlock('Старшая школа — подготовка к ГИА (ОГЭ) и ЕГЭ', 'left', media.hero.id),
        makeProgramBlock('Условия приёма', ['Шаг 1', 'Шаг 2', 'Шаг 3']),
        makeCtaFormBlock(),
      ],
      meta: {
        title: 'Семейные классы',
        description: PLACEHOLDER_TEXT,
        image: media.hero.id,
      },
    },
    {
      slug: 'school-preparation',
      title: 'Подготовка к школе',
      pageTitle: 'Подготовка к школе',
      layout: [
        makeHeroBlock({
          title: 'Подготовка к школе',
          primaryButtonLabel: 'Семейные классы',
          primaryButtonLink: '/family-classes',
          secondaryButtonLabel: 'Школа английского языка',
          secondaryButtonLink: '/english-school',
          image: media.hero.id,
        }),
        makeTextImageBlock('Подготовка к школе', 'right', media.hero.id),
        makeTextImageBlock('0-й класс', 'left', media.hero.id),
        makeTextImageBlock('Интенсив', 'right', media.hero.id),
        makeCtaFormBlock(),
      ],
      meta: {
        title: 'Подготовка к школе',
        description: PLACEHOLDER_TEXT,
        image: media.hero.id,
      },
    },
    {
      slug: 'after-school',
      title: 'Группа продлённого дня',
      pageTitle: 'Группа продлённого дня',
      layout: [
        makeHeroBlock({
          title: 'Группа продлённого дня',
          primaryButtonLabel: 'Кружки',
          primaryButtonLink: '/clubs',
          secondaryButtonLabel: 'Активные каникулы',
          secondaryButtonLink: '/active-holidays',
          image: media.hero.id,
        }),
        makeTextImageBlock('Продлённый день', 'right', media.hero.id),
        makeAudienceBlock('Для кого', ['Группа 1', 'Группа 2', 'Группа 3']),
        makeProgramBlock('Программа', ['Пункт 1', 'Пункт 2', 'Пункт 3']),
        makeScheduleBlock('Расписание', ['День 1', 'День 2', 'День 3']),
        makeCtaFormBlock(),
      ],
      meta: {
        title: 'Группа продлённого дня',
        description: PLACEHOLDER_TEXT,
        image: media.hero.id,
      },
    },
    {
      slug: 'active-holidays',
      title: 'Активные каникулы',
      pageTitle: 'Активные каникулы',
      layout: [
        makeHeroBlock({
          title: 'Активные каникулы',
          primaryButtonLabel: 'Школа английского языка',
          primaryButtonLink: '/english-school',
          secondaryButtonLabel: 'О Новой школе',
          secondaryButtonLink: '/about',
          image: media.hero.id,
        }),
        makeTextImageBlock('Летние смены с английским', 'right', media.hero.id),
        makeAudienceBlock('Для кого', ['Группа 1', 'Группа 2', 'Группа 3']),
        makeProgramBlock('Сюжеты', ['Сюжет 1', 'Сюжет 2', 'Сюжет 3']),
        makeProgramBlock('Программа', ['Этап 1', 'Этап 2', 'Этап 3']),
        makeScheduleBlock('Расписание', ['День 1', 'День 2', 'День 3']),
        makeTextImageBlock('Промежуточные каникулы', 'right', media.hero.id),
        makeAudienceBlock('Для кого', ['Группа 1', 'Группа 2', 'Группа 3']),
        makeProgramBlock('Сюжеты', ['Сюжет 1', 'Сюжет 2', 'Сюжет 3']),
        makeProgramBlock('Программа', ['Этап 1', 'Этап 2', 'Этап 3']),
        makeScheduleBlock('Расписание', ['День 1', 'День 2', 'День 3']),
        makeCtaFormBlock(),
      ],
      meta: {
        title: 'Активные каникулы',
        description: PLACEHOLDER_TEXT,
        image: media.hero.id,
      },
    },
    {
      slug: 'english-school',
      title: 'Школа английского языка',
      pageTitle: 'Школа английского языка',
      layout: [
        makeHeroBlock({
          title: 'Школа английского языка',
          primaryButtonLabel: 'Кружки',
          primaryButtonLink: '/clubs',
          secondaryButtonLabel: 'Сведения об образовательной организации',
          secondaryButtonLink: '/organization-info',
          image: media.hero.id,
        }),
        makeTextImageBlock('Общее описание', 'right', media.hero.id),
        makeTextImageBlock('Дошкольники', 'left', media.hero.id),
        makeTextImageBlock('Школьники', 'right', media.hero.id),
        makeTextImageBlock('Подготовка к экзаменам', 'left', media.hero.id),
        makeTextImageBlock('Взрослые', 'right', media.hero.id),
        makeTextImageBlock('Индивидуальные занятия', 'left', media.hero.id),
        makeCtaFormBlock(),
      ],
      meta: {
        title: 'Школа английского языка',
        description: PLACEHOLDER_TEXT,
        image: media.hero.id,
      },
    },
    {
      slug: 'clubs',
      title: 'Кружки',
      pageTitle: 'Кружки',
      layout: [
        makeHeroBlock({
          title: 'Кружки',
          primaryButtonLabel: 'Семейные классы',
          primaryButtonLink: '/family-classes',
          secondaryButtonLabel: 'Школа английского языка',
          secondaryButtonLink: '/english-school',
          image: media.hero.id,
        }),
        makeTextImageBlock('Кружки и секции', 'right', media.hero.id),
        makeCollectionGridBlock('Кружки', 'clubs', 5),
        makeCtaFormBlock(),
      ],
      meta: {
        title: 'Кружки',
        description: PLACEHOLDER_TEXT,
        image: media.hero.id,
      },
    },
    {
      slug: 'about',
      title: 'О Новой школе',
      pageTitle: 'О Новой школе',
      layout: [
        makeTextImageBlock('О Новой школе', 'right', media.hero.id),
        makeCollectionGridBlock('Новости', 'news', 3),
        makeCollectionGridBlock('Галерея', 'galleryAlbums', 2),
        makeCollectionGridBlock('Отзывы', 'reviews', 3),
        makeProgramBlock('Способы оплаты', ['Способ 1', 'Способ 2', 'Способ 3']),
        makeCollectionGridBlock('Преподаватели', 'teachers', 3),
        makeCollectionGridBlock('Вакансии', 'jobs', 2),
        makeTextImageBlock('Контакты', 'right', media.hero.id),
        makeCtaFormBlock(),
      ],
      meta: {
        title: 'О Новой школе',
        description: PLACEHOLDER_TEXT,
        image: media.hero.id,
      },
    },
    {
      slug: 'organization-info',
      title: 'Сведения об образовательной организации',
      pageTitle: 'Сведения об образовательной организации',
      layout: [
        makeTextImageBlock('Сведения об образовательной организации', 'right', media.hero.id),
        makeProgramBlock('Разделы для заполнения', [
          'Основные сведения',
          'Структура и органы управления образовательной организацией',
          'Документы',
          'Образование',
          'Образовательные стандарты и требования',
          'Руководство. Педагогический состав',
          'Материально-техническое обеспечение и оснащённость',
          'Платные образовательные услуги',
          'Финансово-хозяйственная деятельность',
          'Вакантные места для приёма (перевода)',
          'Международное сотрудничество',
          'Доступная среда',
        ]),
      ],
      meta: {
        title: 'Сведения об образовательной организации',
        description: PLACEHOLDER_TEXT,
        image: media.hero.id,
      },
    },
  ] as const

  const seededPages: Record<string, SeededPage> = {}

  for (const page of pages) {
    const createdPage = await upsertPublishedDoc(payload, 'pages', 'slug', page.slug, {
      title: page.title,
      pageTitle: page.pageTitle,
      layout: page.layout,
      meta: page.meta,
      slug: page.slug,
      generateSlug: false,
    }, {
      draft: false,
    })

    seededPages[page.slug] = {
      id: createdPage.id as number,
    }
  }

  return seededPages
}

async function seedHeader(
  payload: Awaited<ReturnType<typeof getPayload>>,
  pages: Record<string, SeededPage>,
) {
  const header = await payload.findGlobal({
    depth: 0,
    disableErrors: true,
    overrideAccess: true,
    slug: 'header',
  })

  const existingNavigationLinks = Array.isArray(header?.navigationLinks) ? header.navigationLinks : []
  const demoLinkExists = existingNavigationLinks.some((item) => {
    const link = item?.link

    if (!link) {
      return false
    }

    if (link.type === 'reference') {
      if (typeof link.reference?.value === 'object') {
        return link.reference.value.slug === 'demo'
      }

      return link.reference?.value === pages.demo?.id
    }

    return link.url === '/demo'
  })

  const fallbackNavigationLinks: NavigationLink[] = [
    pages.home ? makePageNavigationLink('Главная', pages.home.id) : makeUrlNavigationLink('Главная', '/'),
    pages.about ? makePageNavigationLink('О школе', pages.about.id) : makeUrlNavigationLink('О школе', '/about'),
    pages.clubs ? makePageNavigationLink('Кружки', pages.clubs.id) : makeUrlNavigationLink('Кружки', '/clubs'),
    pages.demo ? makePageNavigationLink('Демо', pages.demo.id) : makeUrlNavigationLink('Демо', '/demo'),
  ]

  const navigationLinks =
    existingNavigationLinks.length > 0
      ? [
          ...existingNavigationLinks,
          ...(demoLinkExists ? [] : [pages.demo ? makePageNavigationLink('Демо', pages.demo.id) : makeUrlNavigationLink('Демо', '/demo')]),
        ]
      : fallbackNavigationLinks

  if (header) {
    await payload.updateGlobal({
      data: {
        navigationLinks,
      },
      slug: 'header',
    })
    return
  }

  await payload.updateGlobal({
    data: {
      navigationLinks,
    },
    slug: 'header',
  })
}

async function main() {
  const payload = await getPayload({ config })

  try {
    const media = await seedMedia(payload)
    await seedCollections(payload)
    const pages = await seedPages(payload, media)
    await seedHeader(payload, pages)

    console.log('Development seed completed successfully.')
  } finally {
    await payload.destroy()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
