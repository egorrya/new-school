import 'dotenv/config'

import path from 'path'

import { getPayload, type CollectionSlug } from 'payload'

import config from '@payload-config'
import type { Footer, Header } from '@/payload-types'

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
  const allMediaFiles = [...seedMediaFiles, ...orgInfoMediaFiles]
  const seededMedia = await Promise.all(allMediaFiles.map((media) => upsertUpload(payload, media)))

  return seededMedia.reduce<Record<string, { id: number }>>((accumulator, media, index) => {
    accumulator[allMediaFiles[index].key] = {
      id: media.id,
    }

    return accumulator
  }, {})
}

async function seedCollections(
  payload: Awaited<ReturnType<typeof getPayload>>,
  media: Record<string, { id: number }>,
) {
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
      authorName: 'Ирина Соколова',
      authorDescription: 'мама ученицы 2 класса',
      text: 'Дочка ходит в «Новую школу» второй год — видно, как учителя находят подход к каждому ребёнку. Особенно нравится, что английский и шахматы уже включены в расписание — не нужно возить по кружкам после уроков.',
      avatarPreset: 'women/micah-1784914470498.svg',
      isPublished: true,
      sortOrder: 1,
    },
    {
      authorName: 'Дмитрий Кузнецов',
      authorDescription: 'папа ученика 4 класса',
      text: 'Выбирали школу с небольшими классами и вниманием к ребёнку — «Новая школа» полностью оправдала ожидания. Сын стал увереннее отвечать у доски, а учителя всегда на связи и рассказывают, как идут дела.',
      avatarPreset: 'men/micah-1784914786335.svg',
      isPublished: true,
      sortOrder: 2,
    },
    {
      authorName: 'Анна Волкова',
      authorDescription: 'мама двух учеников',
      text: 'Оба моих ребёнка учатся здесь — и разница с обычной школой заметна сразу: программа по ФГОС, но подача живая, без зубрёжки. Отдельное спасибо за подготовительные классы — младший пришёл в первый класс уже читающим и считающим.',
      avatarPreset: 'women/micah-1784914502367.svg',
      isPublished: true,
      sortOrder: 3,
    },
  ] as const

  const reviewAuthorNames = reviewSeeds.map((review) => review.authorName)

  for (const review of reviewSeeds) {
    await upsertPublishedDoc(
      payload,
      'reviews',
      'authorName',
      review.authorName,
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
      authorName: {
        not_in: reviewAuthorNames,
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
          primaryButtonLink: '/family-classes',
          secondaryButtonLabel: 'Подготовка к школе',
          secondaryButtonLink: '/school-preparation',
          image: media.hero.id,
        }),
        makeMarqueeBlock(),
        makeTextImageBlock('О школе', 'right', media.hero.id),
        makeWhyUsFeatureCardsBlock(),
        makeCollectionGridBlock('Галерея', 'galleryAlbums', 6, false, ''),
        makeCollectionGridBlock('Отзывы', 'reviews', 3),
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
        makeFaqBlock('Частые вопросы', [
          'Как устроен этот демо-блок?',
          'Можно ли менять вопросы в админке?',
          'Сколько вопросов можно добавить?',
        ]),
        makeCollectionGridBlock('Кружки', 'clubs', 3),
        makeCollectionGridBlock('Новости', 'news', 3, true),
        makeCollectionGridBlock('Преподаватели', 'teachers', 3),
        makeCollectionGridBlock('Отзывы', 'reviews', 3),
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
        makeCollectionGridBlock('Новости', 'news', 3, true),
        makeCollectionGridBlock('Галерея', 'galleryAlbums', 2, true),
        makeCollectionGridBlock('Отзывы', 'reviews', 3),
        makeProgramBlock('Способы оплаты', ['Способ 1', 'Способ 2', 'Способ 3']),
        makeCollectionGridBlock('Преподаватели', 'teachers', 3),
        makeCollectionGridBlock('Вакансии', 'jobs', 2),
        makeTextImageBlock('Контакты', 'right', media.hero.id),
      ],
      meta: {
        title: 'О Новой школе',
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

  return seededPages
}

async function seedHeader(
  payload: Awaited<ReturnType<typeof getPayload>>,
  pages: Record<string, SeededPage>,
) {
  const navigationLinks: NavigationLink[] = [
    pages.home ? makePageNavigationLink('Главная', pages.home.id) : makeUrlNavigationLink('Главная', '/'),
    pages.about ? makePageNavigationLink('О школе', pages.about.id) : makeUrlNavigationLink('О школе', '/about'),
    pages.clubs ? makePageNavigationLink('Кружки', pages.clubs.id) : makeUrlNavigationLink('Кружки', '/clubs'),
    makeUrlNavigationLink('Новости', '/news'),
    pages.demo ? makePageNavigationLink('Демо', pages.demo.id) : makeUrlNavigationLink('Демо', '/demo'),
  ]

  const secondaryHeaderLinks: NavigationLink[] = [
    makeUrlNavigationLink('Сведения об образовательной организации', '/organization-info'),
  ]

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

type FooterLegalLink = NonNullable<Footer['legalLinks']>[number]

function makeFooterUrlLink(label: string, url: string): FooterLegalLink {
  return {
    link: {
      label,
      newTab: false,
      type: 'custom',
      url,
    },
  }
}

async function seedFooter(payload: Awaited<ReturnType<typeof getPayload>>) {
  const footer = await payload.findGlobal({
    slug: 'footer',
    overrideAccess: true,
  })

  const existingLinks = footer.legalLinks ?? []
  const alreadyLinked = existingLinks.some((item) => item.link?.url === '/organization-info')

  if (alreadyLinked) return

  await payload.updateGlobal({
    context: SEED_CONTEXT,
    data: {
      legalLinks: [
        ...existingLinks,
        makeFooterUrlLink('Сведения об образовательной организации', '/organization-info'),
      ],
    },
    overrideAccess: true,
    slug: 'footer',
  })
}

async function seedSiteSettings(payload: Awaited<ReturnType<typeof getPayload>>) {
  await payload.updateGlobal({
    context: SEED_CONTEXT,
    data: {
      phone: '+7 (925) 292-40-96',
      address: 'г. Королёв, пр-кт Королёва, д. 5Д, пом. 501',
      vkUrl: 'https://vk.com/newschool_korolev',
      telegramUrl: 'https://t.me/New_School_Korolev',
      whatsappUrl: 'https://web.whatsapp.com/send?phone=79252924096',
    },
    slug: 'site-settings',
  })
}

async function main() {
  const payload = await getPayload({ config })

  try {
    const media = await seedMedia(payload)
    await seedCollections(payload, media)
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
