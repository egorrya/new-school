import 'dotenv/config'

import path from 'path'

import { getPayload, type CollectionSlug } from 'payload'

import config from '@payload-config'
import { defaultLegalEntityText } from '@/globals/Footer/defaults'
import type { Header } from '@/payload-types'

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

function programImageDoc(key: string, filename: string, alt: string): SeedMediaInput {
  return {
    key,
    filename,
    alt,
    filePath: path.resolve(process.cwd(), 'public/seed-media/programs', filename),
  }
}

const programMediaFiles: SeedMediaInput[] = [
  programImageDoc('clubKulinariya', 'kulinariya.jpg', 'Кулинарный мастер-класс в «Новой школе»'),
  programImageDoc('clubRukodelie', 'rukodelie.jpg', 'Занятие по рукоделию в «Новой школе»'),
  programImageDoc(
    'clubHudozhestvennayaStudiya',
    'hudozhestvennaya-studiya.jpg',
    'Занятие художественной студии в «Новой школе»',
  ),
  programImageDoc(
    'clubTeatralnayaStudiya',
    'muzykalno-teatralnaya-studiya.jpg',
    'Занятие музыкально-театральной студии в «Новой школе»',
  ),
  programImageDoc('clubKrasivoePismo', 'krasivoe-pismo.jpg', 'Занятие по каллиграфии в «Новой школе»'),
  programImageDoc('clubAnglDoshkolniki', 'angl-doshkolniki.jpg', 'Английский для дошкольников в «Новой школе»'),
  programImageDoc('clubAnglShkolniki', 'angl-shkolniki.jpg', 'Английский для школьников в «Новой школе»'),
  programImageDoc('clubAnglOgeEge', 'angl-oge-ege.jpg', 'Подготовка к ЕГЭ и ОГЭ по английскому языку в «Новой школе»'),
  programImageDoc('clubAnglVzroslye', 'angl-vzroslye.jpg', 'Английский для взрослых в «Новой школе»'),
  programImageDoc('clubLetnyayaSmenaCover', 'letnyaya-smena-cover.jpg', 'Дети на летних каникулах в английском клубе «Новой школы»'),
  programImageDoc('clubLetnyayaSmenaPreview', 'letnyaya-smena-preview.jpg', 'Стрельба из лука на летней смене в «Новой школе»'),
  programImageDoc(
    'clubPromezhutochnyeKanikulyCover',
    'promezhutochnye-kanikuly-cover.jpg',
    'Творческая мастерская на каникулярной смене в «Новой школе»',
  ),
  programImageDoc(
    'clubPromezhutochnyeKanikulyPreview',
    'promezhutochnye-kanikuly-preview.jpg',
    'Занятие творческой мастерской на каникулярной смене в «Новой школе»',
  ),
  programImageDoc(
    'clubPodgotovkaKShkole',
    'podgotovka-k-shkole.jpg',
    'Занятие по подготовке к школе в «Новой школе»',
  ),
]

function orgInfoDoc(key: string, filename: string, alt: string): SeedMediaInput {
  return {
    key,
    filename,
    alt,
    filePath: path.resolve(process.cwd(), 'public/seed-media/org-info', filename),
  }
}

const orgInfoMediaFiles: SeedMediaInput[] = [
  orgInfoDoc('orgDocReestr', 'reestrovaya-vypiska.pdf', 'Выписка из реестра лицензий'),
  orgInfoDoc(
    'orgDoc12',
    '1.2_polozhenie-o-pedagogicheskom-sovete.pdf',
    'Положение о педагогическом совете',
  ),
  orgInfoDoc(
    'orgDoc13',
    '1.3_polozhenie-o-normah-prof-etiki-pedagogicheskih-rabotnikov.pdf',
    'Положение о нормах профессиональной этики педагогических работников',
  ),
  orgInfoDoc(
    'orgDoc14',
    '1.4_polozhenie-o-poryadke-predostavleniya-mto.pdf',
    'Положение о порядке предоставления доступа к информационным и образовательным ресурсам',
  ),
  orgInfoDoc(
    'orgDoc15',
    '1.5_polozhenie-o-poryadke-besplatnogo-polzovaniya-uslugami.pdf',
    'Положение о порядке бесплатного пользования услугами',
  ),
  orgInfoDoc(
    'orgDoc16',
    '1.6_polozhenie-o-rezhime-rabochego-vremeni-pedagogicheskih-rabotnikov.pdf',
    'Положение о режиме рабочего времени педагогических работников',
  ),
  orgInfoDoc(
    'orgDoc17',
    '1.7_polozhenie-o-sootnoshenii-uchebnoj-i-drugoj-ped-raboty.pdf',
    'Положение о соотношении учебной и другой педагогической работы',
  ),
  orgInfoDoc(
    'orgDoc21',
    'u-2.1_pravila-vnutrennego-trudovogo-rasporyadka.pdf',
    'Правила внутреннего трудового распорядка',
  ),
  orgInfoDoc(
    'orgDoc22',
    'u-2.2_pravila-vnutrennego-rasporyadka-obuchayushhihsya.pdf',
    'Правила внутреннего распорядка обучающихся',
  ),
  orgInfoDoc('orgDoc23', 'u-2.3_pravila-priema.pdf', 'Правила приёма обучающихся'),
  orgInfoDoc(
    'orgDoc24',
    'u-2.4_polozhenie-o-rezhime-zanyatij-obuchayushhihsya-i-formah-obucheniya.pdf',
    'Положение о режиме занятий обучающихся и формах обучения',
  ),
  orgInfoDoc(
    'orgDoc25',
    'u-2.5_ob-obuchenii-po-individualnomu-uchebnomu-planu.pdf',
    'Положение об обучении по индивидуальному учебному плану',
  ),
  orgInfoDoc(
    'orgDoc26',
    'u-2.6_polozhenie-o-tekushhem-kontrole-promezhutochnom-kontrole-itogovoj-attestaczii.pdf',
    'Положение о текущем контроле, промежуточном контроле и итоговой аттестации',
  ),
  orgInfoDoc(
    'orgDoc27',
    'u-2.7_polozhenie-o-poryadke-perevoda-otchisleniya-vosstanovleniya.pdf',
    'Положение о порядке перевода, отчисления и восстановления обучающихся',
  ),
  orgInfoDoc(
    'orgDoc28',
    'u-2.8_poryadok-oformleniya-vozniknoveniya-priostanovleniya-i-prekrashheniya-otnoshenij.pdf',
    'Порядок оформления возникновения, приостановления и прекращения образовательных отношений',
  ),
  orgInfoDoc(
    'orgDoc29',
    '2.9_polozhenie-o-poryadke-provedeniya-samoosledovaniya.pdf',
    'Положение о порядке проведения самообследования',
  ),
  orgInfoDoc(
    'orgDoc210',
    '2.10_polozhenie-o-vnutrennej-sisteme-oczenki-kachestva-obrazovaniya.pdf',
    'Положение о внутренней системе оценки качества образования',
  ),
  orgInfoDoc(
    'orgDoc211',
    '2.11_polozhenie-o-sovete-obuchayushhihsya.pdf',
    'Положение о совете обучающихся',
  ),
  orgInfoDoc(
    'orgDoc212',
    '2.12_polozhenie-o-rabochej-gruppe-po-protivodejstviyu-i-predotvrashheniyu-korrupczii.pdf',
    'Положение о рабочей группе по противодействию и предотвращению коррупции',
  ),
  orgInfoDoc(
    'orgDoc213',
    'u-2.13_o-poryadke-hraneniya-v-arhivah.pdf',
    'Порядок хранения результатов освоения программ в архивах',
  ),
  orgInfoDoc(
    'orgDoc214',
    '2.14_polozhenie-o-poryadke-polzovaniya-uchebnymi-posobiyami.pdf',
    'Положение о порядке пользования учебными пособиями',
  ),
  orgInfoDoc(
    'orgDoc215',
    'u-2.15_polozhenie-ob-inf-otkrytosti-i-oficzialnom-sajte.pdf',
    'Положение об информационной открытости и официальном сайте',
  ),
  orgInfoDoc(
    'orgDoc216',
    '2.16_polozhenie-o-komissii-po-regulirovaniyu-sporov.pdf',
    'Положение о комиссии по регулированию споров',
  ),
  orgInfoDoc(
    'orgDoc217',
    '2.17_polozhenie-o-konflikte-interesov.pdf',
    'Положение о конфликте интересов',
  ),
  orgInfoDoc(
    'orgDoc218',
    'u-2.18_polozhenie-ob-obrabotke-personalnyh-dannyh.pdf',
    'Положение об обработке персональных данных',
  ),
  orgInfoDoc(
    'orgDoc219',
    'u-2.19_polozhenie-o-poryadke-rasmotreniya-obrashhenij-grazhdan.pdf',
    'Положение о порядке рассмотрения обращений граждан',
  ),
  orgInfoDoc(
    'orgDoc220',
    'u-2.20_polozhenie-ob-eo-i-dot.pdf',
    'Положение об электронном обучении и дистанционных образовательных технологиях',
  ),
  orgInfoDoc(
    'orgDocProgram59',
    'programma-novaya-shkola-5-9-klass.pdf',
    'Программа «Новая школа», 5–9 класс',
  ),
  orgInfoDoc(
    'orgDocEnglishProgram',
    'rabochaya-programma-skan.pdf',
    'Рабочая программа «Увлекательный английский»',
  ),
  orgInfoDoc(
    'orgDoc41',
    'u-4.1_polozhenie-o-poryadke-predostavleniya-platnyh-obrazovatelnyh-uslug.pdf',
    'Положение о порядке предоставления платных образовательных услуг (с образцом договора)',
  ),
  orgInfoDoc(
    'orgDoc43',
    '4.3_polozhenie-ob-osnovaniyah-i-poryadke-snizheniya-stoimosti-platnyh-obrazovatelnyh-uslug-docx.pdf',
    'Положение об основаниях и порядке снижения стоимости платных образовательных услуг',
  ),
  orgInfoDoc('orgDocPrice', 'prajs.pdf', 'Приказ о стоимости обучения (прайс-лист)'),
]

function makeHeroBlock({
  title = 'Школа, где детям интересно учиться',
  description = 'Помогаем детям учиться, раскрывать способности и находить свои сильные стороны через занятия, проекты и живое общение',
  primaryButtonLabel = 'Оставить заявку',
  primaryButtonLink,
  secondaryButtonLabel,
  secondaryButtonLink,
  image,
}: {
  title?: string
  description?: string
  primaryButtonLabel?: string
  primaryButtonLink: string
  secondaryButtonLabel?: string
  secondaryButtonLink?: string
  image?: number | null
  }) {
  return {
    blockType: 'hero',
    title,
    description,
    image: image ?? null,
    primaryButtonLabel,
    primaryButtonLink,
    secondaryButtonLabel: secondaryButtonLabel ?? null,
    secondaryButtonLink: secondaryButtonLink ?? null,
  }
}

function makeTitleDescriptionBlock(title: string, description: string = PLACEHOLDER_TEXT) {
  return {
    blockType: 'titleDescription',
    title,
    description,
  }
}

const DEFAULT_MARQUEE_ITEMS = [
  'Собираем роботов',
  'Пишем код',
  'Творим',
  'Говорим',
  'Тренируем логику',
  'Выступаем',
  'Пробуем новое',
  'Делаем своими руками',
  'Учимся вместе',
]

function makeMarqueeBlock(items: string[] = DEFAULT_MARQUEE_ITEMS) {
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

function makeTextSectionBlock(
  title: string,
  text: string,
  imagePosition: 'left' | 'right',
  image?: number | null,
) {
  return {
    blockType: 'textImage',
    title,
    text,
    image: image ?? null,
    imagePosition,
  }
}

function makeContactsBlock(title?: string, description?: string) {
  return {
    blockType: 'contacts',
    title: title ?? null,
    description: description ?? null,
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

function makeFaqBlock(title: string, questions: string[]) {
  return {
    blockType: 'faq',
    title,
    description: PLACEHOLDER_TEXT,
    items: questions.map((question) => ({
      question,
      answer: PLACEHOLDER_TEXT,
    })),
  }
}

function makeFeatureCardsBlock(title: string, cardTexts: string[]) {
  const icons = ['book-open', 'users', 'sparkles']

  return {
    blockType: 'featureCards',
    title,
    description: PLACEHOLDER_TEXT,
    cards: cardTexts.map((cardText, index) => ({
      text: cardText,
      iconName: icons[index % icons.length],
      image: null,
    })),
  }
}

function makeWhyUsFeatureCardsBlock() {
  return {
    blockType: 'featureCards',
    title: 'Почему мы?',
    description: null,
    cards: [
      {
        text: 'Опытные учителя с профильным образованием',
        iconName: 'graduation-cap',
        image: null,
      },
      {
        text: 'Все предметы по ФГОС. Высокий уровень знаний',
        iconName: 'book-open',
        image: null,
      },
      {
        text: 'Индивидуальный подход к способностям каждого ребенка',
        iconName: 'users',
        image: null,
      },
      {
        text: 'Дополнительный английский и шахматы в расписании',
        iconName: 'calendar-days',
        image: null,
      },
      {
        text: 'Работа в элементах лучших финских образовательных технологий',
        iconName: 'lightbulb',
        image: null,
      },
      {
        text: 'Коммуникативная методика при изучении английского языка',
        iconName: 'heart-handshake',
        image: null,
      },
    ],
  }
}

function makeProgramCategoriesBlock(
  title: string,
  description: string = PLACEHOLDER_TEXT,
  hideTitle = false,
) {
  return {
    blockType: 'programCategories',
    title,
    hideTitle,
    description,
  }
}

function makeCollectionGridBlock(
  title: string,
  collectionType: 'clubs' | 'news' | 'teachers' | 'reviews' | 'jobs' | 'galleryAlbums',
  itemLimit: number,
  showViewAllButton = false,
  description: string = PLACEHOLDER_TEXT,
) {
  return {
    blockType: 'collectionGrid',
    title,
    description,
    collectionType,
    itemLimit,
    showViewAllButton,
    viewAllButtonLabel: 'Смотреть все',
  }
}

function makeRichText(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        children: [{ type: 'text', text, version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

function makeRichTextList(items: string[]) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'list',
          listType: 'bullet',
          tag: 'ul',
          start: 1,
          children: items.map((text, index) => ({
            type: 'listitem',
            value: index + 1,
            children: [{ type: 'text', text, version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          })),
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

type RichTextBlockInput = { type: 'paragraph'; text: string } | { type: 'list'; items: string[] }

function makeRichTextMixed(blocks: RichTextBlockInput[]) {
  return {
    root: {
      type: 'root',
      children: blocks.map((block) => {
        if (block.type === 'list') {
          return {
            type: 'list',
            listType: 'bullet',
            tag: 'ul',
            start: 1,
            children: block.items.map((text, index) => ({
              type: 'listitem',
              value: index + 1,
              children: [{ type: 'text', text, version: 1 }],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            })),
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          }
        }

        return {
          type: 'paragraph',
          children: [{ type: 'text', text: block.text, version: 1 }],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        }
      }),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

type NavigationLink = NonNullable<Header['navigationLinks']>[number]
type NavigationSubLink = NonNullable<NavigationLink['subLinks']>[number]

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

function makePageNavigationSubLink(label: string, pageId: number): NavigationSubLink {
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

function makeUrlNavigationSubLink(label: string, url: string): NavigationSubLink {
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

async function unlockPageDocument(
  payload: Awaited<ReturnType<typeof getPayload>>,
  pageId: number,
) {
  const locks = await payload.find({
    collection: 'payload-locked-documents',
    depth: 0,
    limit: 100,
    overrideAccess: true,
    pagination: false,
    where: {
      and: [
        {
          'document.relationTo': {
            equals: 'pages',
          },
        },
        {
          'document.value': {
            equals: pageId,
          },
        },
      ],
    } as never,
  })

  for (const lock of locks.docs) {
    await payload.delete({
      id: lock.id,
      collection: 'payload-locked-documents',
      context: SEED_CONTEXT,
      overrideAccess: true,
    })
  }
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
      filePath,
      id: existing.id,
      overrideAccess: true,
      overwriteExistingFiles: true,
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
  const allMediaFiles = [...seedMediaFiles, ...orgInfoMediaFiles, ...programMediaFiles]
  const seededMedia = await Promise.all(allMediaFiles.map((media) => upsertUpload(payload, media)))

  return seededMedia.reduce<Record<string, { id: number }>>((accumulator, media, index) => {
    accumulator[allMediaFiles[index].key] = {
      id: media.id,
    }

    return accumulator
  }, {})
}

async function seedProgramCategories(
  payload: Awaited<ReturnType<typeof getPayload>>,
  media: Record<string, { id: number }>,
): Promise<Record<string, { id: number }>> {
  const categories = [
    {
      slug: 'kruzhki',
      generateSlug: false,
      title: 'Кружки',
      description: 'Кулинария, рукоделие, искусство и театральная студия для детей.',
      previewImage: media.clubHudozhestvennayaStudiya.id,
    },
    {
      slug: 'anglijskij',
      generateSlug: false,
      title: 'Школа английского языка',
      description: 'Английский для всех возрастов, включая подготовку к ОГЭ и ЕГЭ.',
      previewImage: media.clubAnglShkolniki.id,
    },
    {
      slug: 'aktivnye-kanikuly',
      generateSlug: false,
      title: 'Активные каникулы',
      description: 'Клуб полного дня на каникулах: игры, творчество и английский язык.',
      previewImage: media.clubLetnyayaSmenaPreview.id,
    },
    {
      slug: 'podgotovka-k-shkole',
      generateSlug: false,
      title: 'Подготовка к школе',
      description: 'Для дошкольников 5–7 лет: готовим руку к письму, учим читать и считать.',
      previewImage: media.clubPodgotovkaKShkole.id,
    },
  ] as const

  const categoriesMap: Record<string, { id: number }> = {}

  for (const category of categories) {
    const result = await upsertPublishedDoc(
      payload,
      'programCategories',
      'slug',
      category.slug,
      category as Record<string, unknown>,
    )
    categoriesMap[category.slug] = result
  }

  return categoriesMap
}

async function seedCollections(
  payload: Awaited<ReturnType<typeof getPayload>>,
  media: Record<string, { id: number }>,
  programCategories: Record<string, { id: number }>,
) {
  const collectionSeeds = [
    {
      slug: 'kulinariya',
      generateSlug: false,
      title: 'Кулинария',
      shortDescription: 'Мастер-классы по кулинарии для детей с 8 лет: готовим блюда и десерты.',
      category: programCategories.kruzhki.id,
      previewImage: media.clubKulinariya.id,
      coverImage: media.clubKulinariya.id,
      infoCards: [
        { title: 'Возраст', description: 'От 8 лет', icon: 'baby' },
        { title: 'Формат', description: 'Блоки по 4 занятия', icon: 'calendar-days' },
        { title: 'Чему учимся', description: 'Готовим повседневные блюда и десерты', icon: 'utensils' },
      ],
      tabs: [
        {
          title: 'О программе',
          content: makeRichText([
            'Дети обожают готовить! А времени на готовку с детьми часто не хватает. Наши мастер-классы по кулинарии — это то, чего не хватает сегодняшним детям: развитие практического жизненно необходимого навыка с огромным удовольствием.',
          ]),
        },
        {
          title: 'Чему учимся',
          content: makeRichText([
            'Занятия по кулинарии проводятся блоками по 4 занятия. В каждом блоке мы учимся не только печь тортики и печенье, но и готовить повседневные блюда, знакомимся с правилами правильного питания и технологией приготовления блюд, осваиваем новые простые и сложные рецепты, которые можно повторить дома.',
          ]),
        },
        {
          title: 'Для кого',
          layout: [
            {
              blockType: 'audience',
              title: 'Для кого подходит кружок',
              text: 'Кружок подходит детям, которые хотят научиться готовить самостоятельно.',
              hideHeader: true,
              items: [
                {
                  title: 'Для детей от 8 лет',
                  text: 'Учатся готовить повседневные блюда и десерты, осваивают новые рецепты и основы правильного питания.',
                },
              ],
            },
          ],
        },
      ],
      isActive: true,
      sortOrder: 1,
    },
    {
      slug: 'rukodelie',
      generateSlug: false,
      title: 'Рукоделие',
      shortDescription: 'Вязание, вышивка, бисероплетение и макраме для детей с 6 лет.',
      category: programCategories.kruzhki.id,
      previewImage: media.clubRukodelie.id,
      coverImage: media.clubRukodelie.id,
      infoCards: [
        { title: 'Возраст', description: 'От 6 лет', icon: 'baby' },
        { title: 'Техники', description: 'Вязание, вышивка, бисероплетение, макраме', icon: 'sparkles' },
        { title: 'Что делаем', description: 'Игрушки, пояса, чехлы и подарки своими руками', icon: 'heart-handshake' },
      ],
      tabs: [
        {
          title: 'О программе',
          content: makeRichText([
            'Вязание крючком и спицами, вышивка, бисероплетение, плетение шнуров-поясов, макраме и множество других навыков, незаслуженно забытых, снова входят в моду и являются лучшим лекарством от дефицита внимания, свойственного современным детям.',
          ]),
        },
        {
          title: 'Что мы делаем',
          content: makeRichText([
            'Мы возвращаем в жизнь детей подарки, сделанные своими руками: игрушку-брелок, пояс, чехол для телефона, сумку-несессер, корзинку для мелочей и многое другое, сделанное вручную.',
          ]),
        },
        {
          title: 'Для кого',
          layout: [
            {
              blockType: 'audience',
              title: 'Для кого подходит кружок',
              text: 'Кружок подходит детям, которым интересно мастерить руками.',
              hideHeader: true,
              items: [
                {
                  title: 'Для детей от 6 лет',
                  text: 'Осваивают вязание, вышивку, бисероплетение и другие техники, создавая подарки своими руками.',
                },
              ],
            },
          ],
        },
      ],
      isActive: true,
      sortOrder: 2,
    },
    {
      slug: 'hudozhestvennaya-studiya',
      generateSlug: false,
      title: 'Художественная студия',
      shortDescription: 'Рисуем и лепим, знакомясь с творчеством известных художников.',
      category: programCategories.kruzhki.id,
      previewImage: media.clubHudozhestvennayaStudiya.id,
      coverImage: media.clubHudozhestvennayaStudiya.id,
      infoCards: [
        { title: 'Формат', description: 'Практические занятия по живописи и скульптуре', icon: 'palette' },
        { title: 'Цель', description: 'Формируем художественную насмотренность и кругозор', icon: 'sparkles' },
      ],
      tabs: [
        {
          title: 'О студии',
          content: makeRichText([
            'Изучение мировой художественной культуры на практических занятиях: не просто учить живописи и скульптуре, но и просвещать, формировать общий кругозор в сфере искусства — главная задача нашей студии.',
            'В «Новой школе» детям рассказывают о художнике, показывают его картины, обсуждают их, формируя художественную насмотренность, а затем предлагают нарисовать картину в стиле этого художника. Даже если ребёнок не свяжет свою жизнь с искусством, он будет в нём разбираться и сможет поддержать беседу.',
          ]),
        },
        {
          title: 'Что мы изучаем',
          content: makeRichText([
            'Мы изучаем художественные стили, воплощая их в живописных и скульптурных работах — от народного творчества до современных направлений в живописи и скульптуре.',
          ]),
        },
        {
          title: 'Для кого',
          layout: [
            {
              blockType: 'audience',
              title: 'Для кого подходит студия',
              text: 'Студия подходит и детям, и взрослым — программа адаптируется под возраст и уровень подготовки.',
              hideHeader: true,
              items: [
                {
                  title: 'Для детей',
                  text: 'Рисуют и лепят, знакомясь с разными художественными стилями.',
                },
                {
                  title: 'Для взрослых',
                  text: 'Мастер-классы по выходным в том же направлении.',
                },
              ],
            },
          ],
        },
      ],
      isActive: true,
      sortOrder: 3,
    },
    {
      slug: 'muzykalno-teatralnaya-studiya',
      generateSlug: false,
      title: 'Музыкально-театральная студия',
      shortDescription: 'Актёрское мастерство, сценическая речь и движение для детей.',
      category: programCategories.kruzhki.id,
      previewImage: media.clubTeatralnayaStudiya.id,
      coverImage: media.clubTeatralnayaStudiya.id,
      coverImagePosition: 'top',
      infoCards: [
        { title: 'Направления', description: 'Актёрское мастерство, сценическая речь и движение', icon: 'mic' },
        { title: 'Развиваем', description: 'Коммуникативные навыки и уверенность в себе', icon: 'heart-handshake' },
        { title: 'Формат', description: 'Групповые занятия и постановки', icon: 'users' },
      ],
      tabs: [
        {
          title: 'О программе',
          content: makeRichText([
            'Театральная студия — это мир фантазии, ярких образов, огромных возможностей для актёрского перевоплощения. Программа занятий включает такие направления, как актёрское мастерство, сценическое движение, сценическая речь и другие.',
          ]),
        },
        {
          title: 'Что развивают занятия',
          content: makeRichText([
            'Занятия актёрским мастерством помогают развивать коммуникативные навыки, эмоциональный интеллект, творческие навыки, уверенность в себе, концентрацию и память.',
            'Неоценима и воспитательная роль театрализованной деятельности. Она учит доброте, чуткости, честности, смелости, формирует понятия добра и зла. Робкому ребёнку игра поможет стать более смелым и решительным, застенчивому — преодолеть неуверенность в себе.',
          ]),
        },
        {
          title: 'Для кого',
          layout: [
            {
              blockType: 'audience',
              title: 'Для кого подходит студия',
              text: 'Студия подходит детям, которым интересно сценическое творчество.',
              hideHeader: true,
              items: [
                {
                  title: 'Для детей',
                  text: 'Развивают актёрское мастерство, сценическую речь и уверенность в себе на групповых занятиях и постановках.',
                },
              ],
            },
          ],
        },
      ],
      isActive: true,
      sortOrder: 4,
    },
    {
      slug: 'krasivoe-pismo',
      generateSlug: false,
      title: 'Красивое письмо',
      shortDescription: 'Искусство красивого письма для детей с 7 лет: почерк и скорость письма.',
      category: programCategories.kruzhki.id,
      previewImage: media.clubKrasivoePismo.id,
      coverImage: media.clubKrasivoePismo.id,
      infoCards: [
        { title: 'Возраст', description: 'От 7 лет', icon: 'baby' },
        { title: 'Развиваем', description: 'Аккуратный почерк и скорость письма', icon: 'pen-tool' },
        { title: 'Формат', description: 'Регулярные занятия чистописанием', icon: 'calendar-days' },
      ],
      tabs: [
        {
          title: 'О программе',
          content: makeRichText([
            'Каллиграфия — искусство красивого письма, в котором отражена целостность отдельных букв и всего текста, его гармоничность, форма и ритм.',
            'Чистописание — это искусство аккуратного письма, правила письма и соединений. По сути, это две части одного целого: чистописание помогает писать аккуратно и быстро, а каллиграфия — это творчество, стиль, эстетика. Для школьников начать стоит с чистописания — формирования аккуратного и разборчивого почерка, что положительно скажется не только на успеваемости, но и на самооценке ребёнка.',
          ]),
        },
        {
          title: 'Чем полезна каллиграфия',
          content: makeRichTextList([
            'Аккуратный разборчивый почерк.',
            'Высокая скорость письма.',
            'Внимательность к деталям.',
            'Красота письма и грамотность.',
            'Развитие мышления и памяти в целом.',
          ]),
        },
        {
          title: 'Для кого',
          layout: [
            {
              blockType: 'audience',
              title: 'Для кого подходит кружок',
              text: 'Кружок подходит детям, которые хотят писать аккуратно и красиво.',
              hideHeader: true,
              items: [
                {
                  title: 'Для детей от 7 лет',
                  text: 'Формируют аккуратный почерк и осваивают основы каллиграфии.',
                },
              ],
            },
          ],
        },
      ],
      isActive: true,
      sortOrder: 5,
    },
    {
      slug: 'anglijskij-dlya-doshkolnikov',
      generateSlug: false,
      title: 'Английский для дошкольников',
      shortDescription: 'Английский для детей 4–6 лет: разговорная речь и подготовка к чтению.',
      category: programCategories.anglijskij.id,
      previewImage: media.clubAnglDoshkolniki.id,
      coverImage: media.clubAnglDoshkolniki.id,
      infoCards: [
        { title: 'Возраст', description: '4–6 лет', icon: 'baby' },
        { title: 'Формат', description: 'Группы до 6 человек, занятие 60 минут', icon: 'users' },
        { title: 'Расписание', description: 'С сентября по май', icon: 'calendar-days' },
      ],
      tabs: [
        {
          title: 'О программе',
          content: makeRichText([
            'Занятия ведут преподаватели с международной квалификацией TKT: Young Learners. Программа учитывает возрастные преимущества восприятия английского языка и психологические особенности дошкольников, поэтому дети занимаются с удовольствием и без напряжения.',
            'Группы формируются по возрасту и уже имеющемуся уровню английского языка — так каждому ребёнку комфортно заниматься в своём темпе.',
          ]),
        },
        {
          title: 'Чему учится ребёнок',
          content: makeRichText([
            'Основной акцент — на развитии восприятия речи на слух и разговорных навыках: ребёнок учится понимать простую английскую речь и говорить простыми фразами, а также готовится к дальнейшему обучению чтению на английском.',
          ]),
        },
        {
          title: 'Для кого',
          layout: [
            {
              blockType: 'audience',
              title: 'Для кого подходит программа',
              text: 'Программа подходит детям дошкольного возраста, которые делают первые шаги в английском языке.',
              hideHeader: true,
              items: [
                {
                  title: 'Для детей 4–6 лет',
                  text: 'Развивают восприятие речи на слух, учатся говорить простыми фразами и готовятся к чтению.',
                },
              ],
            },
          ],
        },
      ],
      isActive: true,
      sortOrder: 6,
    },
    {
      slug: 'anglijskij-dlya-shkolnikov',
      generateSlug: false,
      title: 'Английский для школьников',
      shortDescription: 'Английский для учеников 7–17 лет: 2 занятия в неделю, все навыки языка.',
      category: programCategories.anglijskij.id,
      previewImage: media.clubAnglShkolniki.id,
      coverImage: media.clubAnglShkolniki.id,
      infoCards: [
        { title: 'Возраст', description: '7–17 лет', icon: 'baby' },
        { title: 'Формат', description: '2 занятия в неделю по 80 минут', icon: 'calendar-days' },
        { title: 'Итог', description: 'Сертификат по итогам итоговой аттестации', icon: 'award' },
      ],
      tabs: [
        {
          title: 'О программе',
          content: makeRichText([
            'Интенсивные регулярные занятия проходят два раза в неделю по 80 минут с сентября по май. Группы формируются по возрасту учеников и уровню владения английским языком — до 8 человек в группе.',
            'Занятия ведут преподаватели с педагогическим образованием или международным сертификатом, подтверждающим право преподавания английского языка, с уровнем владения языком Advanced и выше.',
          ]),
        },
        {
          title: 'Чему учимся',
          content: makeRichText([
            'Развиваем грамотную разговорную речь, восприятие речи на слух, чтение и письмо — программа учитывает возрастные особенности восприятия языка. По итогам обучения и успешной итоговой аттестации ученик получает сертификат.',
          ]),
        },
        {
          title: 'Для кого',
          layout: [
            {
              blockType: 'audience',
              title: 'Для кого подходит программа',
              text: 'Программа подходит школьникам, которые системно изучают английский язык.',
              hideHeader: true,
              items: [
                {
                  title: 'Для учеников 7–17 лет',
                  text: 'Развивают разговорную речь, аудирование, чтение и письмо в группе сверстников своего уровня.',
                },
              ],
            },
          ],
        },
      ],
      isActive: true,
      sortOrder: 7,
    },
    {
      slug: 'podgotovka-k-ege-i-oge',
      generateSlug: false,
      title: 'Подготовка к ЕГЭ и ОГЭ',
      shortDescription: 'Подготовка к ОГЭ и ЕГЭ по английскому для 9–11 классов в мини-группах.',
      category: programCategories.anglijskij.id,
      previewImage: media.clubAnglOgeEge.id,
      coverImage: media.clubAnglOgeEge.id,
      infoCards: [
        { title: 'Классы', description: '9–11 классы', icon: 'graduation-cap' },
        { title: 'Формат', description: 'Мини-группы до 4 человек, занятие 90 минут', icon: 'users' },
        { title: 'Результат', description: '86% выпускников — от 80 баллов на ЕГЭ', icon: 'trophy' },
      ],
      tabs: [
        {
          title: 'О программе',
          content: makeRichText([
            'Программа подготовки построена в соответствии с федеральными образовательными стандартами базового и углублённого уровня. Занятия проходят в мини-группах до 4 человек по 90 минут с сентября по май — такой формат позволяет уделить внимание разбору сложных тем и типичных ошибок каждого ученика.',
          ]),
        },
        {
          title: 'Результаты',
          content: makeRichText([
            'Мы делаем ставку на комплексное развитие всех аспектов языка, необходимых для экзамена: грамматики, аудирования, чтения, письма и говорения. 86% наших учеников, сдававших ЕГЭ по английскому языку, получили более 80 баллов. По итогам курса выдаётся сертификат.',
          ]),
        },
        {
          title: 'Для кого',
          layout: [
            {
              blockType: 'audience',
              title: 'Для кого подходит программа',
              text: 'Программа подходит старшеклассникам, которые готовятся сдавать ОГЭ или ЕГЭ по английскому языку.',
              hideHeader: true,
              items: [
                {
                  title: 'Для учеников 9–11 классов',
                  text: 'Разбирают формат экзамена, закрывают пробелы в знаниях и тренируются на реальных заданиях в мини-группе.',
                },
              ],
            },
          ],
        },
      ],
      isActive: true,
      sortOrder: 8,
    },
    {
      slug: 'anglijskij-dlya-vzroslyh',
      generateSlug: false,
      title: 'Английский для взрослых',
      shortDescription: 'Английский для взрослых: небольшие группы и разговорная практика.',
      category: programCategories.anglijskij.id,
      previewImage: media.clubAnglVzroslye.id,
      coverImage: media.clubAnglVzroslye.id,
      infoCards: [
        { title: 'Возраст', description: 'От 17 лет', icon: 'baby' },
        { title: 'Формат', description: 'Группы до 10 человек, занятие 100 минут', icon: 'users' },
        { title: 'Метод', description: 'Разговорная практика с первого занятия', icon: 'mic' },
      ],
      tabs: [
        {
          title: 'О программе',
          content: makeRichText([
            'Зачисление в группу проходит по результатам тестирования — так каждый занимается на своём уровне. Занятия проходят с сентября по май, группа — до 10 человек, длительность занятия — 100 минут.',
            'Занятия ведут преподаватели с педагогическим образованием или международным сертификатом и уровнем владения языком Advanced и выше.',
          ]),
        },
        {
          title: 'Как проходят занятия',
          content: makeRichText([
            'Используем коммуникативную методику: говорить по-английски мы начинаем уже на первом занятии. Развиваем грамотную разговорную речь, восприятие речи на слух, чтение и письмо, но в приоритете — именно живое общение. Свои учебные пособия студенты приобретают самостоятельно.',
          ]),
        },
        {
          title: 'Для кого',
          layout: [
            {
              blockType: 'audience',
              title: 'Для кого подходит программа',
              text: 'Программа подходит взрослым, которые хотят уверенно говорить по-английски.',
              hideHeader: true,
              items: [
                {
                  title: 'Для взрослых от 17 лет',
                  text: 'Занимаются в группе своего уровня и практикуют разговорную речь с первого занятия.',
                },
              ],
            },
          ],
        },
      ],
      isActive: true,
      sortOrder: 9,
    },
    {
      slug: 'individualnye-zanyatiya-anglijskim',
      generateSlug: false,
      title: 'Индивидуальные занятия',
      shortDescription: 'Индивидуальные занятия английским: личная программа и гибкий график.',
      category: programCategories.anglijskij.id,
      previewImage: media.banner1.id,
      coverImage: media.banner1.id,
      infoCards: [
        { title: 'Формат', description: '1 ученик — 1 преподаватель', icon: 'users' },
        { title: 'Расписание', description: 'Гибкое, по договорённости', icon: 'clock' },
        { title: 'Цель', description: 'Под любую задачу — от школьной программы до бизнес-английского', icon: 'star' },
      ],
      tabs: [
        {
          title: 'О программе',
          content: makeRichText([
            'Индивидуальные занятия подходят ученикам любого возраста — от дошкольников до взрослых — которым важен личный темп и содержание курса, полностью подстроенное под их задачу. Расписание согласовывается индивидуально, а преподавателя подбираем с учётом возраста и уровня ученика.',
            'Формат хорошо дополняет групповые программы «Новой школы» или полностью заменяет их, если ребёнку или взрослому нужно более пристальное внимание преподавателя.',
          ]),
        },
        {
          title: 'Как строится программа',
          content: makeRichText([
            'Перед началом занятий определяем текущий уровень и цель: помощь со школьной программой, подготовка к ОГЭ или ЕГЭ, разговорный английский для путешествий или общения, деловой английский. Исходя из этого преподаватель составляет личный план занятий и корректирует его по ходу обучения.',
          ]),
        },
        {
          title: 'Для кого',
          layout: [
            {
              blockType: 'audience',
              title: 'Для кого подходит формат',
              text: 'Индивидуальные занятия подходят тем, кому нужен личный темп и особое внимание к своей задаче.',
              hideHeader: true,
              items: [
                {
                  title: 'Для детей и школьников',
                  text: 'Подтягивают школьную программу, закрывают пробелы или готовятся к экзаменам в своём темпе.',
                },
                {
                  title: 'Для взрослых',
                  text: 'Осваивают разговорный или деловой английский под свой график и конкретную цель.',
                },
              ],
            },
          ],
        },
      ],
      isActive: true,
      sortOrder: 10,
    },
    {
      slug: 'letnie-smeny-s-anglijskim',
      generateSlug: false,
      title: 'Летние смены с английским',
      shortDescription: 'Летний клуб полного дня для детей 7–12 лет: игры, творчество и английский язык.',
      category: programCategories['aktivnye-kanikuly'].id,
      previewImage: media.clubLetnyayaSmenaPreview.id,
      coverImage: media.clubLetnyayaSmenaCover.id,
      infoCards: [
        { title: 'Возраст', description: 'От 7 до 12 лет', icon: 'baby' },
        { title: 'Формат', description: 'Пн–Пт, 8:30–18:30', icon: 'clock' },
        { title: 'Смена', description: '2 недели, All Inclusive', icon: 'calendar-days' },
        { title: 'Питание', description: '3-разовое + 2 перекуса', icon: 'utensils' },
      ],
      tabs: [
        {
          title: 'Для кого',
          layout: [
            {
              blockType: 'audience',
              title: 'Для кого подходит клуб',
              text: 'Полный день с английским языком, играми и творчеством — пока родители спокойно работают.',
              hideHeader: false,
              items: [
                {
                  title: 'Дети 7–12 лет',
                  text: 'Проводят каникулы в кругу сверстников: играют, разговаривают на английском и каждый день пробуют что-то новое.',
                },
                {
                  title: 'Родители',
                  text: 'Получают ежедневные фото- и видеоотчёты и могут быть спокойны за ребёнка с 8:30 до 18:30.',
                },
              ],
            },
          ],
        },
        {
          title: 'Сюжеты',
          content: makeRichTextMixed([
            {
              type: 'paragraph',
              text: 'Каждая смена — это отдельная история, вокруг которой строятся игры, мастер-классы и финальный проект:',
            },
            {
              type: 'list',
              items: [
                'Мультвселенная — снимаем мультфильм: придумываем персонажей и сценарий, лепим, рисуем, озвучиваем; переозвучиваем сцены из любимых мультфильмов, играем в тематические квизы и викторины.',
                'Всё в театр — готовим театральную постановку: сценарий, костюмы, реквизит, репетиции и премьера. Экскурсия за кулисы настоящего театра и мастер-классы от актёров.',
                'Профессия блогер — снимаем ролики с оригинальной подачей и интересным контентом: дети снимают, родители смотрят и комментируют.',
                'Фабрика звёзд — ищем талант в каждом ребёнке: поём, танцуем, показываем фокусы, готовим номера и костюмы — и выступаем в «Минуту славы» в финале смены.',
              ],
            },
            {
              type: 'paragraph',
              text: 'Тематика смен обновляется каждый год — актуальный список уточняйте у администратора.',
            },
          ]),
        },
        {
          title: 'Программа',
          layout: [
            {
              blockType: 'program',
              title: 'Что входит в смену',
              description:
                'Английский язык каждый день с лучшими преподавателями, а вокруг него — насыщенная программа для активных каникул.',
              items: [
                {
                  title: 'Английский каждый день',
                  text: '2 академических часа: разговорная практика, новые слова и фразы из уст героев любимых мультфильмов и фильмов. Дети делятся на группы по возрасту и уровню языка.',
                },
                {
                  title: 'Творческие мастер-классы',
                  text: 'Поделки из подручных материалов, эксперименты, кулинария — всё своими руками.',
                },
                {
                  title: 'Активные игры на свежем воздухе',
                  text: 'Футбол, бадминтон, скакалки, салки — каждый день на улице.',
                },
                {
                  title: 'Поход, боулинг или экскурсия',
                  text: 'В зависимости от погоды — а ещё квест с настоящим поиском сокровищ.',
                },
                {
                  title: 'Финальный фестиваль',
                  text: 'Проект или спектакль по теме смены, награждение команд и вручение дипломов.',
                },
              ],
            },
          ],
        },
        {
          title: 'Расписание',
          layout: [
            {
              blockType: 'schedule',
              title: 'Расписание смен',
              description: 'Пять дней в неделю, полный день присмотра и занятий.',
              scheduleItems: [
                { label: 'Дни недели', value: 'Пн–Пт' },
                { label: 'Время', value: '8:30–18:30' },
                { label: 'Смена 1', value: '1–11 июня 2026' },
                { label: 'Смена 2', value: '15–26 июня 2026' },
                { label: 'Смена 3', value: '27 июля – 7 августа 2026' },
                { label: 'Смена 4', value: '10–21 августа 2026' },
              ],
            },
          ],
        },
        {
          title: 'Стоимость',
          content: makeRichTextMixed([
            {
              type: 'paragraph',
              text: 'Полная стоимость двухнедельной смены — 41 000 ₽ (All Inclusive): ежедневный английский, трёхразовое питание и два перекуса, поездка на лазертаг или экскурсия, все мастер-классы и материалы.',
            },
            {
              type: 'list',
              items: [
                'Раннее бронирование (до 31 марта) — скидка 15%.',
                'Семьям с детьми, которые идут к нам впервые, — скидка 10%, а если ребёнок уже был в лагере — 15%.',
                'Постоянным ученикам школы и тем, кто уже был в лагере, — скидка 10%.',
                'Если день рождения ребёнка приходится на смену — скидка 10%.',
                'Приведи друга — скидка 10% приведшему и 5% другу.',
              ],
            },
            {
              type: 'paragraph',
              text: 'Скидки не суммируются. Точную стоимость и свободные места уточняйте у администратора.',
            },
          ]),
        },
      ],
      isActive: true,
      sortOrder: 11,
    },
    {
      slug: 'promezhutochnye-kanikuly',
      generateSlug: false,
      title: 'Промежуточные каникулы',
      shortDescription: 'Клуб полного дня на каникулах для детей 7–12 лет: творчество и английский язык.',
      category: programCategories['aktivnye-kanikuly'].id,
      previewImage: media.clubPromezhutochnyeKanikulyPreview.id,
      coverImage: media.clubPromezhutochnyeKanikulyCover.id,
      infoCards: [
        { title: 'Возраст', description: 'От 7 до 12 лет', icon: 'baby' },
        { title: 'Формат', description: 'Пн–Пт, 8:30–18:30', icon: 'clock' },
        { title: 'Смена', description: '1 неделя (5 дней)', icon: 'calendar-days' },
        { title: 'Питание', description: '3-разовое + 2 перекуса', icon: 'utensils' },
      ],
      tabs: [
        {
          title: 'Для кого',
          layout: [
            {
              blockType: 'audience',
              title: 'Для кого подходит клуб',
              text: 'Полный день с английским языком, играми и творчеством на осенних, зимних и весенних каникулах — пока родители спокойно работают.',
              hideHeader: false,
              items: [
                {
                  title: 'Дети 7–12 лет',
                  text: 'Не сидят дома у экрана, а проводят каникулы в компании сверстников, играя и разговаривая по-английски.',
                },
                {
                  title: 'Родители',
                  text: 'Получают ежедневные фото- и видеоотчёты и присмотр за ребёнком на всю рабочую неделю каникул.',
                },
              ],
            },
          ],
        },
        {
          title: 'Сюжеты',
          content: makeRichTextMixed([
            {
              type: 'paragraph',
              text: 'Каждая смена строится вокруг своего сюжета — с играми, мастер-классами и финальным проектом внутри. Вот несколько тем, которые мы уже проводили:',
            },
            {
              type: 'list',
              items: [
                'Мультвселенная — снимаем мультфильм: придумываем персонажей и сценарий, лепим, рисуем, озвучиваем; переозвучиваем сцены из любимых мультфильмов, играем в тематические квизы и викторины.',
                'Всё в театр — готовим театральную постановку: сценарий, костюмы, реквизит, репетиции и премьера. Экскурсия за кулисы настоящего театра и мастер-классы от актёров.',
                'Профессия блогер — снимаем ролики с оригинальной подачей и интересным контентом: дети снимают, родители смотрят и комментируют.',
                'Фабрика звёзд — ищем талант в каждом ребёнке: поём, танцуем, показываем фокусы, готовим номера и костюмы — и выступаем в «Минуту славы» в финале смены.',
              ],
            },
            {
              type: 'paragraph',
              text: 'Тема конкретной смены на осенних, зимних и весенних каникулах уточняется отдельно у администратора.',
            },
          ]),
        },
        {
          title: 'Программа',
          layout: [
            {
              blockType: 'program',
              title: 'Что входит в смену',
              description: 'Тот же формат, что и летом, — только неделя, чтобы уместиться в короткие школьные каникулы.',
              items: [
                {
                  title: 'Английский каждый день',
                  text: '2 академических часа: разговорная практика, новые слова и фразы из уст героев любимых мультфильмов и фильмов. Дети делятся на группы по возрасту и уровню языка.',
                },
                {
                  title: 'Творческие мастер-классы',
                  text: 'Поделки из подручных материалов, эксперименты, кулинария — всё своими руками.',
                },
                {
                  title: 'Активные игры',
                  text: 'Подвижные игры и спорт каждый день — на улице или в зале, в зависимости от погоды.',
                },
                {
                  title: 'Поход, боулинг или экскурсия',
                  text: 'В зависимости от погоды — а ещё квест с настоящим поиском сокровищ.',
                },
                {
                  title: 'Финальный фестиваль',
                  text: 'Проект или спектакль по теме смены, награждение команд и вручение дипломов.',
                },
              ],
            },
          ],
        },
        {
          title: 'Расписание',
          layout: [
            {
              blockType: 'schedule',
              title: 'Расписание смен',
              description: 'Одна неделя — пять полных дней в разгар школьных каникул.',
              scheduleItems: [
                { label: 'Дни недели', value: 'Пн–Пт' },
                { label: 'Время', value: '8:30–18:30' },
                { label: 'Продолжительность', value: '5 дней (1 неделя)' },
                { label: 'Когда', value: 'Осенние, зимние и весенние каникулы — точные даты по школьному календарю' },
              ],
            },
          ],
        },
        {
          title: 'Стоимость',
          content: makeRichTextMixed([
            {
              type: 'paragraph',
              text: 'Стоимость недельной смены на осенних, зимних и весенних каникулах — по запросу: она зависит от конкретных дат и наполнения программы.',
            },
            {
              type: 'list',
              items: [
                'В стоимость входит ежедневный английский, трёхразовое питание и два перекуса.',
                'Все мастер-классы, материалы и активности внутри смены.',
              ],
            },
            {
              type: 'paragraph',
              text: 'Оставьте заявку или свяжитесь с администратором, чтобы узнать точную цену и свободные места на ближайшую смену.',
            },
          ]),
        },
      ],
      isActive: true,
      sortOrder: 12,
    },
    {
      slug: 'podgotovka-k-shkole',
      generateSlug: false,
      title: 'Подготовка к школе',
      shortDescription: 'Готовим будущих первоклассников к школе: математика, чтение, письмо и речь.',
      category: programCategories['podgotovka-k-shkole'].id,
      previewImage: media.clubPodgotovkaKShkole.id,
      coverImage: media.clubPodgotovkaKShkole.id,
      coverImagePosition: 'top',
      infoCards: [
        { title: 'Возраст', description: '5–7 лет', icon: 'baby' },
        { title: 'Группа', description: 'До 6–8 детей', icon: 'users' },
        { title: 'Формат', description: 'Интенсив или полный день', icon: 'clock' },
        { title: 'Предметы', description: 'Математика, чтение, письмо, речь', icon: 'book-open' },
      ],
      tabs: [
        {
          title: '0-й класс',
          content: makeRichTextMixed([
            {
              type: 'paragraph',
              text: '«Нулевой» класс в «Новой школе» — это игра «в школу» не понарошку: качественная подготовка и адаптация к школьному распорядку для тех, кому уже не интересно в саду, а в школу пока рано.',
            },
            {
              type: 'paragraph',
              text: 'Дети привыкают сидеть за партами, не забывая поиграть на ковре, — а вместо тихого часа их ждёт насыщенный день с английским языком, математикой, чтением и творчеством.',
            },
          ]),
          layout: [
            {
              blockType: 'audience',
              title: 'Для кого подходит',
              text: 'Полный день с адаптацией к школьному распорядку — для детей, которые пойдут в 1-й класс в следующем учебном году.',
              hideHeader: false,
              items: [
                {
                  title: 'Дети 5–7 лет',
                  text: 'Которые собираются в 1-й класс в следующем учебном году и которым нужна полноценная подготовка к школе.',
                },
                {
                  title: 'Дети, которым скучно в саду',
                  text: 'Но в школу идти ещё рано — «нулевой» класс даёт школьный режим и нагрузку по возрасту.',
                },
                {
                  title: 'Родители',
                  text: 'Которые хотят, чтобы ребёнок привык к партам, урокам и переменам заранее, а не с первого сентября.',
                },
              ],
            },
            {
              blockType: 'program',
              title: 'Что входит в программу',
              description:
                'Каждый день — уроки и переменки, как в школе, а вокруг основных предметов — творчество, музыка, спорт и вкусное питание.',
              items: [
                {
                  title: 'Английский язык',
                  text: 'Занятия с преподавателями Школы английского языка SkillSet.',
                },
                {
                  title: 'Математика и чтение',
                  text: 'Основы счёта, подготовка к чтению и работе с текстом.',
                },
                {
                  title: 'Развитие речи и письмо',
                  text: 'Готовим руку к письму и развиваем связную речь.',
                },
                {
                  title: 'Творчество и игра',
                  text: 'Много творческой и развивающей игровой деятельности между занятиями.',
                },
                {
                  title: 'Музыка, ИЗО, физкультура, шахматы',
                  text: 'Дополнительные занятия по всем направлениям.',
                },
                {
                  title: 'Питание',
                  text: 'Вкусное и здоровое свежеприготовленное питание, соответствующее нормам СанПиНа.',
                },
              ],
            },
            {
              blockType: 'schedule',
              title: 'Расписание',
              description: 'Полный учебный день по будням.',
              scheduleItems: [
                { label: 'Дни недели', value: 'Пн–Пт' },
                { label: 'Время', value: '8:30–15:30' },
                { label: 'Размер группы', value: 'До 8 детей' },
              ],
            },
          ],
        },
        {
          title: 'Интенсив',
          content: makeRichTextMixed([
            {
              type: 'paragraph',
              text: 'Компактный формат подготовки к школе для тех, кто не готов к полному дню: математика, чтение, подготовка руки к письму и развитие речи в формате школьных уроков и переменок.',
            },
            {
              type: 'paragraph',
              text: 'Есть два варианта — короткий летний интенсив перед 1 сентября и базовый курс на весь учебный год.',
            },
          ]),
          layout: [
            {
              blockType: 'audience',
              title: 'Для кого подходит',
              text: 'Подходит тем, кто идёт в 1-й класс в этом сентябре, и тем, кто готовится к школе заранее, в течение года.',
              hideHeader: false,
              items: [
                {
                  title: 'Будущие первоклассники',
                  text: 'Дети, которые в сентябре идут в 1-й класс, — для них летний интенсив за 4 недели до школы.',
                },
                {
                  title: 'Дети, готовящиеся к школе заранее',
                  text: 'Собираются в 1-й класс в следующем учебном году — для них базовый курс в течение года.',
                },
              ],
            },
            {
              blockType: 'program',
              title: 'Что входит в программу',
              description:
                'Математика, чтение, письмо и речь в формате школьных уроков и переменок — привыкаем к школьному распорядку заранее.',
              items: [
                {
                  title: 'Математика',
                  text: 'Базовые математические понятия: сложение и вычитание, сравнение, геометрические фигуры и их свойства, ориентирование в пространстве.',
                },
                {
                  title: 'Чтение',
                  text: 'Учимся читать и работать с текстом.',
                },
                {
                  title: 'Подготовка руки к письму',
                  text: 'Развиваем мелкую моторику и готовим руку к письму.',
                },
                {
                  title: 'Развитие речи',
                  text: 'К концу курса дети умеют не только читать и считать, но и пишут небольшие сочинения.',
                },
              ],
            },
            {
              blockType: 'schedule',
              title: 'Расписание',
              description: 'Два варианта на выбор — летний интенсив или курс в течение года.',
              scheduleItems: [
                { label: 'Летний интенсив', value: '3 раза в неделю по 60 минут, 4 недели перед 1 сентября' },
                { label: 'Базовый курс (будни)', value: '2 раза в неделю по 60 минут, вечером' },
                { label: 'Базовый курс (выходные)', value: '1 раз в неделю по субботам, 90 минут' },
                { label: 'Размер группы', value: 'До 6 детей' },
              ],
            },
          ],
        },
      ],
      isActive: true,
      sortOrder: 13,
    },
  ] as const

  for (const club of collectionSeeds) {
    await upsertPublishedDoc(payload, 'clubs', 'slug', club.slug, club as Record<string, unknown>)
  }

  const newsSeeds = [
    {
      slug: 'novost-1',
      generateSlug: false,
      title: 'Старт нового учебного года в «Новой школе»',
      excerpt: 'Первого сентября мы встретили учеников на торжественной линейке и открыли новый учебный год.',
      content: makeRichText([
        'Первого сентября в «Новой школе» прошла торжественная линейка, посвящённая началу учебного года. Учеников и их родителей поздравили директор и преподаватели, а первоклассники получили памятные подарки.',
        'В этом году в школе открылось два новых класса, а расписание кружков пополнилось дополнительными занятиями английским языком и шахматами. Полное расписание уже доступно в личном кабинете родителей.',
      ]),
      coverImage: media.banner1.id,
      publishedAt: '2025-09-01T08:00:00.000Z',
    },
    {
      slug: 'novost-2',
      generateSlug: false,
      title: 'Открылся набор в кружок «Кулинария»',
      excerpt: 'Учеников начальной школы приглашаем на занятия по кулинарии — готовим, пробуем и учимся работать в команде.',
      content: makeRichText([
        'С этой недели в «Новой школе» стартовали занятия кружка «Кулинария» для учеников 1–4 классов. На первом занятии ребята готовили простые блюда и узнали об основах гигиены на кухне.',
        'Кружок проходит два раза в неделю под руководством опытного педагога. Родители могут записать детей через администратора школы или в личном кабинете.',
      ]),
      coverImage: media.hero.id,
      publishedAt: '2025-09-15T09:00:00.000Z',
    },
    {
      slug: 'novost-3',
      generateSlug: false,
      title: 'Наши ученики победили в городской олимпиаде по английскому языку',
      excerpt: 'Три ученика «Новой школы» заняли призовые места на городской олимпиаде по английскому языку.',
      content: makeRichText([
        'Поздравляем наших учеников с успешным выступлением на городской олимпиаде по английскому языку! Двое ребят заняли первое место в своих возрастных категориях, ещё один ученик — третье место.',
        'Такой результат — заслуга не только учеников, но и коммуникативной методики преподавания английского языка, которую школа использует на всех уровнях обучения.',
      ]),
      coverImage: media.banner2.id,
      publishedAt: '2025-10-03T10:00:00.000Z',
    },
    {
      slug: 'novost-4',
      generateSlug: false,
      title: 'Мастер-класс по шахматам для учеников начальной школы',
      excerpt: 'Провели открытый мастер-класс по шахматам — научились базовым дебютам и сыграли первые турнирные партии.',
      content: makeRichText([
        'В рамках дополнительных занятий шахматами прошёл открытый мастер-класс для учеников начальной школы. Ребята познакомились с базовыми дебютами и попробовали свои силы в мини-турнире.',
        'Шахматы входят в расписание «Новой школы» как обязательный предмет — это помогает развивать логическое мышление и усидчивость у детей с первого класса.',
      ]),
      coverImage: media.hero.id,
      publishedAt: '2025-10-20T09:30:00.000Z',
    },
    {
      slug: 'novost-5',
      generateSlug: false,
      title: 'День открытых дверей: как прошла осенняя встреча с родителями',
      excerpt: 'Провели день открытых дверей для будущих учеников и их родителей — показали классы и рассказали о программе.',
      content: makeRichText([
        'В минувшую субботу школа встречала гостей на дне открытых дверей. Родители будущих учеников познакомились с преподавателями, посетили классы и кружки, а также узнали подробнее о программе обучения по ФГОС.',
        'Отдельное внимание было уделено рассказу о финских образовательных технологиях, которые «Новая школа» внедряет в учебный процесс. Следующий день открытых дверей запланирован на весну.',
      ]),
      coverImage: media.banner1.id,
      publishedAt: '2025-11-12T11:00:00.000Z',
    },
    {
      slug: 'novost-6',
      generateSlug: false,
      title: 'Кружок «Рукоделие» подготовил выставку работ к Новому году',
      excerpt: 'Ученики кружка «Рукоделие» представили новогоднюю выставку своих работ — от открыток до ёлочных игрушек.',
      content: makeRichText([
        'В холле школы открылась предновогодняя выставка работ кружка «Рукоделие». Ребята своими руками изготовили ёлочные игрушки, открытки и праздничные украшения, которые теперь можно увидеть на стендах.',
        'Часть работ ученики подарили сотрудникам школы, а лучшие экспонаты останутся на выставке до конца зимних каникул.',
      ]),
      coverImage: media.banner2.id,
      publishedAt: '2025-12-19T10:00:00.000Z',
    },
    {
      slug: 'novost-7',
      generateSlug: false,
      title: 'Каникулярный интенсив по английскому языку',
      excerpt: 'На зимних каникулах провели интенсив по английскому языку для учеников среднего звена.',
      content: makeRichText([
        'В дни зимних каникул в школе прошёл интенсивный курс английского языка. Занятия проходили в игровом формате с акцентом на разговорную практику и расширение словарного запаса.',
        'По итогам интенсива ученики подготовили небольшие проекты на английском языке и представили их родителям на итоговой встрече.',
      ]),
      coverImage: media.hero.id,
      publishedAt: '2026-01-20T09:00:00.000Z',
    },
    {
      slug: 'novost-8',
      generateSlug: false,
      title: 'Музыкально-театральная студия представила зимний спектакль',
      excerpt: 'Музыкально-театральная студия показала зимний спектакль по мотивам русских сказок.',
      content: makeRichText([
        'Музыкально-театральная студия «Новой школы» представила зрителям спектакль по мотивам русских народных сказок. В постановке приняли участие ученики разных классов — от исполнения ролей до подготовки декораций.',
        'Спектакль собрал полный зал родителей и гостей школы. Студия уже готовит новую постановку к весенним праздникам.',
      ]),
      coverImage: media.banner1.id,
      publishedAt: '2026-02-14T12:00:00.000Z',
    },
    {
      slug: 'novost-9',
      generateSlug: false,
      title: 'Учителя «Новой школы» прошли курс по финским образовательным методикам',
      excerpt: 'Педагоги школы прошли курс повышения квалификации по финским образовательным технологиям.',
      content: makeRichText([
        'Преподавательский состав «Новой школы» завершил курс повышения квалификации, посвящённый финским образовательным методикам. Учителя познакомились с новыми подходами к организации урока и индивидуальной работе с учениками.',
        'Полученные знания педагоги уже начали применять на уроках — в частности, в организации проектной работы и групповых заданий.',
      ]),
      coverImage: media.banner2.id,
      publishedAt: '2026-03-06T09:00:00.000Z',
    },
    {
      slug: 'novost-10',
      generateSlug: false,
      title: 'Художественная студия провела весеннюю выставку рисунков',
      excerpt: 'Художественная студия организовала весеннюю выставку работ учеников всех возрастов.',
      content: makeRichText([
        'В школе открылась весенняя выставка работ художественной студии. На стендах представлены рисунки и творческие работы учеников всех возрастов — от первых акварельных этюдов до сложных композиций старшеклассников.',
        'Выставка будет открыта для посещения в течение месяца, а лучшие работы примут участие в городском конкурсе детского рисунка.',
      ]),
      coverImage: media.hero.id,
      publishedAt: '2026-04-10T10:00:00.000Z',
    },
    {
      slug: 'novost-11',
      generateSlug: false,
      title: 'Выпускной вечер в «Новой школе»',
      excerpt: 'Провели выпускной вечер и попрощались с учениками, которые заканчивают обучение в этом году.',
      content: makeRichText([
        'В «Новой школе» прошёл выпускной вечер для учеников, завершающих обучение в этом году. Ребята получили дипломы, а преподаватели поделились тёплыми пожеланиями на прощание.',
        'Праздничная программа включала выступления творческих коллективов школы и слайд-шоу с воспоминаниями за годы учёбы.',
      ]),
      coverImage: media.banner1.id,
      publishedAt: '2026-05-22T13:00:00.000Z',
    },
    {
      slug: 'novost-12',
      generateSlug: false,
      title: 'Открыт набор в подготовительные классы на новый учебный год',
      excerpt: 'Начался набор в подготовительные классы — рассказываем, как записаться и какие документы понадобятся.',
      content: makeRichText([
        'В «Новой школе» стартовал набор в подготовительные классы на следующий учебный год. Занятия помогают будущим первоклассникам освоить базовые навыки чтения, счёта и письма ещё до начала школьной программы.',
        'Записаться можно через администратора школы или заполнив заявку на сайте. Количество мест в группах ограничено.',
      ]),
      coverImage: media.banner2.id,
      publishedAt: '2026-07-05T09:00:00.000Z',
    },
  ]

  const newsSlugs = newsSeeds.map((news) => news.slug)

  for (const news of newsSeeds) {
    await upsertPublishedDoc(payload, 'news', 'slug', news.slug, news as Record<string, unknown>)
  }

  const staleNews = await payload.find({
    collection: 'news',
    depth: 0,
    limit: 100,
    overrideAccess: true,
    pagination: false,
    where: {
      slug: {
        not_in: newsSlugs,
      },
    },
  })

  for (const stale of staleNews.docs) {
    await payload.delete({
      id: stale.id,
      collection: 'news',
      context: SEED_CONTEXT,
      overrideAccess: true,
    })
  }

  const teacherSeeds: {
    name: string
    position: string
    sortOrder: number
  }[] = []

  for (const teacher of teacherSeeds) {
    await upsertPublishedDoc(payload, 'teachers', 'name', teacher.name, teacher as Record<string, unknown>)
  }

  const placeholderTeacherNames = ['Преподаватель 1', 'Преподаватель 2', 'Преподаватель 3'] as const
  const placeholderTeachers = await payload.find({
    collection: 'teachers',
    depth: 0,
    limit: 100,
    overrideAccess: true,
    pagination: false,
    where: {
      name: {
        in: placeholderTeacherNames,
      },
    },
  })

  for (const teacher of placeholderTeachers.docs) {
    await payload.delete({
      id: teacher.id,
      collection: 'teachers',
      context: SEED_CONTEXT,
      overrideAccess: true,
    })
  }

  const reviewSeeds = [
    {
      authorName: 'Ольга',
      text: 'Волею судеб мы часто переезжали с семьей. И ребёнок мой успел поучиться в 4-х разных школах, с разными системами. Именно «Новая школа» в Королеве осталась любимой, и по этой причине щемит сердце, что теперь она от нас очень далеко. Сейчас понимаю, что «Новая школа», действительно, одна из лучших школ в нашем Московском регионе. Очень хороший педагогический состав. «Наталья Вячеславовна — моя самая любимая учительница навсегда», — так сказал сын.\n\nОчень ценно, что в школе позаботятся обо всем: о занятиях и домашних заданиях, о закупке учебных принадлежностей, об организации экскурсий и праздников... Позаботятся с любовью и всей ответственностью.\n\nЕсли возникают проблемы, то коллектив пытается их решить, а не искать виноватых, как часто бывает.\n\nВ этом году мы уже были в качестве гостей в школе, в новом помещении. Очень уютное, стильное, большое, светлое. Я считаю, повезло жителям Королёва, что имеют возможность отдать детей в такую школу.',
      avatarPreset: 'women/micah-1784914470498.svg',
      isPublished: true,
      sortOrder: 2,
    },
    {
      authorName: 'Ольга',
      text: 'Вспоминаем с теплотой о вашей продленке. Мне, как маме, было очень спокойно и надежно, а дочь до сих пор просится в гости.',
      avatarPreset: 'women/micah-1784914502367.svg',
      isPublished: true,
      sortOrder: 1,
    },
    {
      authorName: 'Ирина',
      text: 'Нам очень нравится воспитатель продленки. Дети делают уроки, гуляют, делают поделки. И, главное, без гаджетов.',
      avatarPreset: 'women/micah-1784914592082.svg',
      isPublished: true,
      sortOrder: 3,
    },
  ] as const

  const reviewTexts = reviewSeeds.map((review) => review.text)

  for (const review of reviewSeeds) {
    await upsertPublishedDoc(
      payload,
      'reviews',
      'text',
      review.text,
      review as Record<string, unknown>,
    )
  }

  const staleReviews = await payload.find({
    collection: 'reviews',
    depth: 0,
    limit: 100,
    overrideAccess: true,
    pagination: false,
    where: {
      text: {
        not_in: reviewTexts,
      },
    },
  })

  for (const stale of staleReviews.docs) {
    await payload.delete({
      id: stale.id,
      collection: 'reviews',
      context: SEED_CONTEXT,
      overrideAccess: true,
    })
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

function orgDoc(media: Record<string, { id: number }>, key: string, title: string) {
  return {
    title,
    file: media[key].id,
  }
}

async function seedOrgInfoSections(
  payload: Awaited<ReturnType<typeof getPayload>>,
  media: Record<string, { id: number }>,
) {
  const sections = [
    {
      slug: 'osnovnye-svedeniya',
      title: 'Основные сведения',
      excerpt: 'Наименование, дата регистрации, режим работы и лицензия образовательной организации.',
      sortOrder: 1,
      content: makeRichText([
        'Полное наименование образовательной организации: Индивидуальный предприниматель Грицан Татьяна Анатольевна.',
        'Сокращённое наименование: ИП Грицан Татьяна Анатольевна.',
        'Дата государственной регистрации: 31.01.2014.',
        'Филиалы и представительства отсутствуют.',
        'Место нахождения: Московская область, г. Королёв.',
        'Режим работы: понедельник – пятница с 08:00 до 17:00. Суббота и воскресенье — выходные дни.',
        'Лицензия на осуществление образовательной деятельности выдана 7 декабря 2016 года.',
      ]),
      documents: [orgDoc(media, 'orgDocReestr', 'Выписка из реестра лицензий')],
    },
    {
      slug: 'struktura-i-organy-upravleniya',
      title: 'Структура и органы управления образовательной организацией',
      excerpt: 'Принципы управления и локальные нормативные акты, регулирующие деятельность органов управления.',
      sortOrder: 2,
      content: makeRichText([
        'Управление образовательной организацией осуществляется на основании принципов единоначалия и в соответствии с законодательством Российской Федерации, включая Федеральный закон от 29.12.2012 № 273-ФЗ «Об образовании в Российской Федерации», а также локальными нормативными актами.',
        'Образовательная организация является индивидуальным предпринимателем без обособленных структурных подразделений (филиалов).',
        'Общее руководство осуществляет Грицан Татьяна Анатольевна.',
      ]),
      documents: [
        orgDoc(media, 'orgDoc12', 'Положение о педагогическом совете'),
        orgDoc(media, 'orgDoc13', 'Положение о нормах профессиональной этики педагогических работников'),
        orgDoc(
          media,
          'orgDoc14',
          'Положение о порядке предоставления доступа к информационным и образовательным ресурсам',
        ),
        orgDoc(media, 'orgDoc15', 'Положение о порядке бесплатного пользования услугами'),
        orgDoc(media, 'orgDoc16', 'Положение о режиме рабочего времени педагогических работников'),
        orgDoc(media, 'orgDoc17', 'Положение о соотношении учебной и другой педагогической работы'),
      ],
    },
    {
      slug: 'dokumenty',
      title: 'Документы',
      excerpt: 'Локальные нормативные акты по основным вопросам организации и осуществления образовательной деятельности.',
      sortOrder: 3,
      content: makeRichText([
        'Локальные нормативные акты образовательной организации по основным вопросам организации и осуществления образовательной деятельности.',
        'Предписания органов, осуществляющих государственный контроль (надзор) в сфере образования, и отчёты об их исполнении — отсутствуют.',
      ]),
      documents: [
        orgDoc(media, 'orgDoc21', 'Правила внутреннего трудового распорядка'),
        orgDoc(media, 'orgDoc22', 'Правила внутреннего распорядка обучающихся'),
        orgDoc(media, 'orgDoc23', 'Правила приёма обучающихся'),
        orgDoc(media, 'orgDoc24', 'Положение о режиме занятий обучающихся и формах обучения'),
        orgDoc(media, 'orgDoc25', 'Положение об обучении по индивидуальному учебному плану'),
        orgDoc(
          media,
          'orgDoc26',
          'Положение о текущем контроле, промежуточном контроле и итоговой аттестации',
        ),
        orgDoc(media, 'orgDoc27', 'Положение о порядке перевода, отчисления и восстановления обучающихся'),
        orgDoc(
          media,
          'orgDoc28',
          'Порядок оформления возникновения, приостановления и прекращения образовательных отношений',
        ),
        orgDoc(media, 'orgDoc29', 'Положение о порядке проведения самообследования'),
        orgDoc(media, 'orgDoc210', 'Положение о внутренней системе оценки качества образования'),
        orgDoc(media, 'orgDoc211', 'Положение о совете обучающихся'),
        orgDoc(media, 'orgDoc212', 'Положение о рабочей группе по противодействию и предотвращению коррупции'),
        orgDoc(media, 'orgDoc213', 'Порядок хранения результатов освоения программ в архивах'),
        orgDoc(media, 'orgDoc214', 'Положение о порядке пользования учебными пособиями'),
        orgDoc(media, 'orgDoc215', 'Положение об информационной открытости и официальном сайте'),
        orgDoc(media, 'orgDoc216', 'Положение о комиссии по регулированию споров'),
        orgDoc(media, 'orgDoc217', 'Положение о конфликте интересов'),
        orgDoc(media, 'orgDoc218', 'Положение об обработке персональных данных'),
        orgDoc(media, 'orgDoc219', 'Положение о порядке рассмотрения обращений граждан'),
        orgDoc(media, 'orgDoc220', 'Положение об электронном обучении и дистанционных образовательных технологиях'),
        orgDoc(media, 'orgDocReestr', 'Выписка из реестра лицензий'),
      ],
    },
    {
      slug: 'obrazovanie',
      title: 'Образование',
      excerpt: 'Реализуемые образовательные программы, сроки обучения и язык преподавания.',
      sortOrder: 4,
      content: makeRichText([
        'Реализуемые образовательные программы:',
        '«Младшая школа – подготовка к аттестации» — дополнительное образование детей, срок обучения 4 года, очная форма.',
        '«Средняя школа – подготовка к аттестации» — дополнительное образование детей, срок обучения 5 лет, очная форма.',
        '«Увлекательный английский» — дополнительное образование детей и взрослых, срок обучения 1 год, очная форма.',
        'Образовательная деятельность ведётся на русском языке.',
      ]),
      documents: [
        orgDoc(media, 'orgDocProgram59', 'Программа «Новая школа», 5–9 класс'),
        orgDoc(media, 'orgDocEnglishProgram', 'Рабочая программа «Увлекательный английский»'),
      ],
    },
    {
      slug: 'rukovodstvo',
      title: 'Руководство',
      excerpt: 'Сведения о руководителе образовательной организации.',
      sortOrder: 5,
      content: makeRichText([
        'Управление осуществляется на основании принципов единоначалия и в соответствии с действующим законодательством Российской Федерации.',
        'Руководитель: Грицан Татьяна Анатольевна, индивидуальный предприниматель.',
        'Обособленные структурные подразделения (филиалы) отсутствуют.',
      ]),
      documents: [],
    },
    {
      slug: 'pedagogicheskij-sostav',
      title: 'Педагогический состав',
      excerpt: 'Сведения о преподавателях образовательной организации.',
      sortOrder: 6,
      content: makeRichText([
        'Педагогический коллектив включает учителей английского языка, математики, русского языка и литературы, учителей начальных классов, а также преподавателей географии, истории и физики.',
        'Педагоги имеют профильное высшее образование и регулярно проходят курсы повышения квалификации, в том числе по работе с ФГОС нового поколения.',
        PLACEHOLDER_TEXT,
      ]),
      documents: [],
    },
    {
      slug: 'materialno-tehnicheskoe-obespechenie',
      title:
        'Материально-техническое обеспечение и оснащённость образовательного процесса. Доступная среда',
      excerpt: 'Оснащение учебных классов и условия доступности образовательной среды.',
      sortOrder: 7,
      content: makeRichText([
        'Каждый учебный класс оборудован необходимой мебелью и техникой: индивидуальные парты (8–12 шт.), стол преподавателя (1 шт.), стулья (9 шт.), маркерная доска (1 шт.), маркеры (3 шт.), ноутбук преподавателя (1 шт.), интерактивная доска (1 шт.).',
        'Условия доступности образовательной организации для инвалидов и лиц с ограниченными возможностями здоровья уточняются у администрации образовательного центра.',
      ]),
      documents: [],
    },
    {
      slug: 'platnye-obrazovatelnye-uslugi',
      title: 'Платные образовательные услуги',
      excerpt: 'Порядок оказания платных образовательных услуг и их стоимость.',
      sortOrder: 8,
      content: makeRichText([
        'Обучение проводится на основании договора между образовательной организацией и обучающимся (его законным представителем). Условия оказания услуг регулируются локальными нормативными актами.',
      ]),
      documents: [
        orgDoc(
          media,
          'orgDoc41',
          'Положение о порядке предоставления платных образовательных услуг (с образцом договора)',
        ),
        orgDoc(
          media,
          'orgDoc43',
          'Положение об основаниях и порядке снижения стоимости платных образовательных услуг',
        ),
        orgDoc(media, 'orgDocPrice', 'Приказ о стоимости обучения (прайс-лист)'),
      ],
    },
    {
      slug: 'finansovo-hozyajstvennaya-deyatelnost',
      title: 'Финансово-хозяйственная деятельность',
      excerpt: 'Источники финансирования образовательного процесса.',
      sortOrder: 9,
      content: makeRichText([
        'Финансово-хозяйственная деятельность осуществляется в соответствии с законодательством Российской Федерации и обеспечивает прозрачное и эффективное использование финансовых средств.',
        'Источники финансирования образовательного процесса: доходы от оказания платных образовательных услуг по заключённым договорам, собственные средства организации, иные не запрещённые законодательством РФ источники.',
      ]),
      documents: [],
    },
    {
      slug: 'vakantnye-mesta',
      title: 'Вакантные места для приёма (перевода) обучающихся',
      excerpt: 'Наличие вакантных мест для приёма и перевода обучающихся.',
      sortOrder: 10,
      content: makeRichText([
        'В настоящее время вакантные места для приёма (перевода) обучающихся отсутствуют.',
        'Бюджетные места не предусмотрены.',
        'Информацию о наличии мест по договорам с оплатой стоимости обучения можно уточнить у администратора образовательного центра.',
      ]),
      documents: [],
    },
    {
      slug: 'stipendii-i-mery-podderzhki',
      title: 'Стипендии и меры поддержки обучающихся',
      excerpt: 'Информация о стипендиях, льготах и общежитии.',
      sortOrder: 11,
      content: makeRichText([
        'Стипендиальное обеспечение не предусмотрено.',
        'Льготы и иные формы социальной поддержки отсутствуют.',
        'Общежитие и интернат для проживания обучающихся не предоставляются.',
      ]),
      documents: [],
    },
    {
      slug: 'mezhdunarodnoe-sotrudnichestvo',
      title: 'Международное сотрудничество',
      excerpt: 'Информация о международных договорах и аккредитации образовательных программ.',
      sortOrder: 12,
      content: makeRichText([
        'Информация о заключённых и планируемых к заключению договорах с иностранными и (или) международными организациями по вопросам образования и науки отсутствует.',
        'Информация о международной аккредитации образовательных программ отсутствует.',
      ]),
      documents: [],
    },
    {
      slug: 'organizatsiya-pitaniya',
      title: 'Организация питания в образовательной организации',
      excerpt: 'Сведения об организации питания обучающихся.',
      sortOrder: 13,
      content: makeRichText(['Организация питания обучающихся не предусмотрена.']),
      documents: [],
    },
  ] as const

  for (const section of sections) {
    await upsertPublishedDoc(payload, 'org-info-sections', 'slug', section.slug, {
      title: section.title,
      slug: section.slug,
      generateSlug: false,
      excerpt: section.excerpt,
      content: section.content,
      documents: section.documents,
      isPublished: true,
      sortOrder: section.sortOrder,
    })
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
          primaryButtonLink: '/contacts',
          secondaryButtonLabel: 'Кружки',
          secondaryButtonLink: '/programs',
          image: media.hero.id,
        }),
        makeMarqueeBlock(),
        makeProgramCategoriesBlock('', '', true),
        makeWhyUsFeatureCardsBlock(),
        makeCollectionGridBlock('О нас говорят', 'reviews', 3, false, ''),
        makeCollectionGridBlock('Наши преподаватели', 'teachers', 3, false, ''),
        makeCollectionGridBlock('Галерея', 'galleryAlbums', 6, false, ''),
        makeCollectionGridBlock('Новости', 'news', 3, true, ''),
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
          primaryButtonLabel: 'К программам',
          primaryButtonLink: '/programs',
          secondaryButtonLabel: 'Контакты',
          secondaryButtonLink: '/contacts',
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
        makeFaqBlock('Частые вопросы', [
          'Как устроен этот демо-блок?',
          'Можно ли менять вопросы в админке?',
          'Сколько вопросов можно добавить?',
        ]),
        makeCollectionGridBlock('Программы', 'clubs', 3),
        makeCollectionGridBlock('Новости', 'news', 3, true),
        makeCollectionGridBlock('Преподаватели', 'teachers', 3),
        makeCollectionGridBlock('О нас говорят', 'reviews', 3, false, ''),
        makeCollectionGridBlock('Вакансии', 'jobs', 2),
        makeCollectionGridBlock('Галерея', 'galleryAlbums', 2),
      ],
      meta: {
        title: 'Демо блоков',
        description: 'Демонстрационная страница со всеми доступными блоками сайта.',
        image: media.hero.id,
      },
    },
    {
      slug: 'programs',
      title: 'Программы',
      pageTitle: 'Программы',
      layout: [
        makeTitleDescriptionBlock(
          'Программы',
          'Кружки, языковая школа и активные каникулы для детей и взрослых — выберите направление, чтобы посмотреть программы внутри.',
        ),
        makeProgramCategoriesBlock('', '', true),
      ],
      meta: {
        title: 'Программы',
        description: PLACEHOLDER_TEXT,
        image: media.hero.id,
      },
    },
    {
      slug: 'contacts',
      title: 'Контакты',
      pageTitle: 'Контакты',
      layout: [
        makeContactsBlock(
          'Свяжитесь с нами',
          'Мы всегда на связи: звоните, пишите в мессенджеры или приезжайте в школу.',
        ),
      ],
      meta: {
        title: 'Контакты',
        description: PLACEHOLDER_TEXT,
        image: media.hero.id,
      },
    },
    {
      slug: 'privacy-policy',
      title: 'Политика конфиденциальности',
      pageTitle: 'Политика конфиденциальности',
      layout: [
        makeTextSectionBlock(
          'Общие положения',
          'Настоящая политика конфиденциальности определяет порядок обработки и защиты персональных данных посетителей сайта «Новая школа» (далее — Школа). Политика разработана в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» и иными нормативными актами Российской Федерации.',
          'right',
          media.hero.id,
        ),
        makeTextSectionBlock(
          'Какие данные мы собираем',
          'При заполнении форм на сайте (заявка на кружок, обратная связь) Школа может обрабатывать: имя, номер телефона, адрес электронной почты, а также иные сведения, которые пользователь сообщает добровольно.',
          'left',
          media.hero.id,
        ),
        makeTextSectionBlock(
          'Цели обработки данных',
          'Персональные данные используются исключительно для связи с пользователем, обработки заявок, информирования об услугах Школы и улучшения качества сайта. Данные не передаются третьим лицам, за исключением случаев, предусмотренных законодательством.',
          'right',
          media.hero.id,
        ),
        makeTextSectionBlock(
          'Хранение и защита данных',
          'Школа принимает необходимые организационные и технические меры для защиты персональных данных от неправомерного доступа, изменения, раскрытия или уничтожения.',
          'left',
          media.hero.id,
        ),
        makeTextSectionBlock(
          'Права пользователя',
          'Пользователь вправе в любой момент отозвать согласие на обработку персональных данных, запросить информацию об обрабатываемых данных или потребовать их удаления, направив запрос по контактным данным, указанным на сайте.',
          'right',
          media.hero.id,
        ),
        makeTextSectionBlock(
          'Изменения политики',
          'Школа оставляет за собой право вносить изменения в настоящую политику. Актуальная версия документа всегда доступна на этой странице.',
          'left',
          media.hero.id,
        ),
      ],
      meta: {
        title: 'Политика конфиденциальности',
        description: PLACEHOLDER_TEXT,
        image: media.hero.id,
      },
    },
    {
      slug: 'personal-data',
      title: 'Документ по персональным данным',
      pageTitle: 'Согласие на обработку персональных данных',
      layout: [
        makeTextSectionBlock(
          'Общие положения',
          'Настоящий документ определяет условия согласия субъекта персональных данных на их обработку Школой при заполнении форм обратной связи и заявок на сайте.',
          'right',
          media.hero.id,
        ),
        makeTextSectionBlock(
          'Согласие на обработку',
          'Заполняя форму на сайте, пользователь подтверждает своё согласие на обработку персональных данных: имени, телефона и иных указанных сведений, свободно, своей волей и в своём интересе.',
          'left',
          media.hero.id,
        ),
        makeTextSectionBlock(
          'Способы обработки',
          'Обработка персональных данных осуществляется с использованием средств автоматизации и без их использования, включая сбор, запись, систематизацию, хранение, уточнение и удаление данных.',
          'right',
          media.hero.id,
        ),
        makeTextSectionBlock(
          'Срок действия согласия',
          'Согласие действует бессрочно и может быть отозвано пользователем в любой момент путём направления письменного заявления по контактным данным Школы.',
          'left',
          media.hero.id,
        ),
        makeTextSectionBlock(
          'Конфиденциальность',
          'Школа обязуется соблюдать конфиденциальность персональных данных и не допускать их распространения без согласия пользователя, за исключением случаев, предусмотренных законодательством РФ.',
          'right',
          media.hero.id,
        ),
      ],
      meta: {
        title: 'Документ по персональным данным',
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

    if (page.slug === 'contacts') {
      await unlockPageDocument(payload, createdPage.id as number)
    }
  }

  // Superseded by the dedicated /organization-info collection + routes.
  const stalePlaceholderPage = await findOneByField(payload, 'pages', 'slug', 'organization-info')
  if (stalePlaceholderPage) {
    await payload.delete({
      id: stalePlaceholderPage.id,
      collection: 'pages',
      context: SEED_CONTEXT,
      overrideAccess: true,
    })
  }

  // Superseded by the /programs/category/kruzhki category listing route.
  const staleKruzhkiPage = await findOneByField(payload, 'pages', 'slug', 'kruzhki')
  if (staleKruzhkiPage) {
    await payload.delete({
      id: staleKruzhkiPage.id,
      collection: 'pages',
      context: SEED_CONTEXT,
      overrideAccess: true,
    })
  }

  const removedStandardPageSlugs = [
    'about',
    'english-school',
    'active-holidays',
    'after-school',
    'school-preparation',
    'family-classes',
  ] as const

  for (const slug of removedStandardPageSlugs) {
    const stalePage = await findOneByField(payload, 'pages', 'slug', slug)

    if (stalePage) {
      await payload.delete({
        id: stalePage.id,
        collection: 'pages',
        context: SEED_CONTEXT,
        overrideAccess: true,
      })
    }
  }

  return seededPages
}

async function seedHeader(
  payload: Awaited<ReturnType<typeof getPayload>>,
  pages: Record<string, SeededPage>,
) {
  const navigationLinks: NavigationLink[] = [
    {
      ...makeUrlNavigationLink('О школе', '/'),
      subLinks: [
        pages.home ? makePageNavigationSubLink('Главная', pages.home.id) : makeUrlNavigationSubLink('Главная', '/'),
        makeUrlNavigationSubLink('Вакансии', '/vacancies'),
        makeUrlNavigationSubLink('Новости', '/news'),
        pages.contacts
          ? makePageNavigationSubLink('Контакты', pages.contacts.id)
          : makeUrlNavigationSubLink('Контакты', '/contacts'),
      ],
    },
    makeUrlNavigationLink('Сведения об образовательной организации', '/organization-info'),
    pages.programs ? makePageNavigationLink('Программы', pages.programs.id) : makeUrlNavigationLink('Программы', '/programs'),
  ]

  const secondaryHeaderLinks: NavigationLink[] = []

  await payload.updateGlobal({
    context: SEED_CONTEXT,
    data: {
      navigationLinks,
      secondaryHeaderLinks,
      showSecondaryHeader: false,
    },
    slug: 'header',
  })
}

async function seedFooter(payload: Awaited<ReturnType<typeof getPayload>>) {
  await payload.updateGlobal({
    context: SEED_CONTEXT,
    data: {
      legalEntityText: defaultLegalEntityText,
    },
    slug: 'footer',
  })
}

async function seedSiteSettings(payload: Awaited<ReturnType<typeof getPayload>>) {
  await payload.updateGlobal({
    context: SEED_CONTEXT,
    data: {
      phone: '+7 (925) 292-40-96',
      address: 'г. Королёв, пр-кт Королёва, д. 5Д, пом. 501',
      workingHours: '8:00 — 20:00',
      vkUrl: 'https://vk.com/newschool_korolev',
      maxUrl: 'https://vk.me/79252924096',
      telegramUrl: 'https://t.me/New_School_Korolev',
      whatsappUrl: 'https://web.whatsapp.com/send?phone=79252924096',
      defaultApplicationCtaText: 'Оставить заявку',
    },
    slug: 'site-settings',
  })
}

async function main() {
  const payload = await getPayload({ config })

  try {
    const media = await seedMedia(payload)
    const programCategories = await seedProgramCategories(payload, media)
    await seedCollections(payload, media, programCategories)
    await seedOrgInfoSections(payload, media)
    const pages = await seedPages(payload, media)
    await seedHeader(payload, pages)
    await seedFooter(payload)
    await seedSiteSettings(payload)

    console.log('Development seed completed successfully.')
  } finally {
    await payload.destroy()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
