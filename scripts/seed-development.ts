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
  skipCloudStorage?: true
}

type SeededPage = {
  id: number
}

const PLACEHOLDER_TEXT = 'Добавьте описание в панели управления.'
const defaultSitePhone = '+7 (925) 292-40-96'
const defaultSitePhoneHref = 'tel:+79252924096'
const SEED_CONTEXT: SeedContext = {
  disableRevalidate: true,
}
const SEED_MEDIA_CONTEXT: SeedContext = {
  ...SEED_CONTEXT,
  ...(process.env.SEED_REUSE_S3 === 'true' ? { skipCloudStorage: true } : {}),
}

const seedMediaFiles: SeedMediaInput[] = [
  {
    key: 'hero',
    filename: 'blob.webp',
    alt: 'Абстрактный blob для фона',
    filePath: path.resolve(process.cwd(), 'public/hero/blob.webp'),
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
  programImageDoc(
    'clubMentalnayaArifmetika',
    'mentalnaya-arifmetika.jpg',
    'Занятие по ментальной арифметике в «Новой школе»',
  ),
  programImageDoc(
    'clubAnglDoshkolniki',
    'angl-doshkolniki.jpg',
    'Дошкольники на занятии английским изучают алфавит с преподавателями',
  ),
  programImageDoc(
    'clubAnglShkolniki',
    'angl-shkolniki.jpg',
    'Преподаватель пишет фразы на английском на доске на занятии со школьниками',
  ),
  programImageDoc(
    'clubAnglOgeEge',
    'angl-oge-ege.jpg',
    'Ученик заполняет бланк ЕГЭ ручкой рядом с паспортом',
  ),
  programImageDoc(
    'clubAnglVzroslye',
    'angl-vzroslye.jpg',
    'Взрослая ученица занимается английским языком онлайн',
  ),
  programImageDoc(
    'clubAnglIndividualnye',
    'angl-individualnye.jpg',
    'Индивидуальное занятие английским: преподаватель и ученица за учебником',
  ),
  programImageDoc(
    'clubAnglShkolaCover',
    'angl-shkola-cover.jpg',
    'Ученики пишут работу по английскому языку в классе с британской символикой',
  ),
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
  programImageDoc(
    'clubGruppaProdlennogoDnya',
    'gruppa-prodlennogo-dnya.jpg',
    'Дети в группе продлённого дня в «Новой школе»',
  ),
  programImageDoc('clubNulevoyKlass', 'nulevoy-klass.jpg', 'Дети на занятии в нулевом классе'),
  programImageDoc('clubNachalnyeKlassy', 'nachalnye-klassy.jpg', 'Ученики начальных классов на уроке'),
  programImageDoc('clubSrednyayaShkola', 'srednyaya-shkola.jpg', 'Ученики средней школы на уроке'),
  programImageDoc(
    'clubStarshieKlassy',
    'starshie-klassy.jpg',
    'Учительница беседует со старшеклассниками в классе на уроке',
  ),
]

function teacherImageDoc(key: string, filename: string, alt: string): SeedMediaInput {
  return {
    key,
    filename,
    alt,
    filePath: path.resolve(process.cwd(), 'public/seed-media/teachers', filename),
  }
}

const teacherMediaFiles: SeedMediaInput[] = [
  teacherImageDoc('teacherJulia', 'julia.jpg', 'Юлия'),
  teacherImageDoc('teacherOlga', 'olga.jpg', 'Ольга'),
  teacherImageDoc('teacherAndrey', 'andrey.jpg', 'Андрей'),
  teacherImageDoc('teacherMaria', 'maria.jpg', 'Мария'),
  teacherImageDoc('teacherEvgenia', 'evgenia.jpg', 'Евгения'),
]

function logoImageDoc(key: string, filename: string, alt: string): SeedMediaInput {
  return {
    key,
    filename,
    alt,
    filePath: path.resolve(process.cwd(), 'public/seed-media/logos', filename),
  }
}

const logoMediaFiles: SeedMediaInput[] = [
  logoImageDoc('logoBig', 'logo-big.webp', 'Логотип «Новой школы»'),
  logoImageDoc('logoCompact', 'logo.webp', 'Компактный логотип «Новой школы»'),
]

function galleryImageDoc(key: string, filename: string, alt: string): SeedMediaInput {
  return {
    key,
    filename,
    alt,
    filePath: path.resolve(process.cwd(), 'public/seed-media/gallery', filename),
  }
}

const galleryMediaFiles: SeedMediaInput[] = [
  galleryImageDoc('gallery01', 'gallery-01.webp', 'Фото из галереи «Новой школы» 1'),
  galleryImageDoc('gallery02', 'gallery-02.webp', 'Фото из галереи «Новой школы» 2'),
  galleryImageDoc('gallery03', 'gallery-03.webp', 'Фото из галереи «Новой школы» 3'),
  galleryImageDoc('gallery04', 'gallery-04.webp', 'Фото из галереи «Новой школы» 4'),
  galleryImageDoc('gallery05', 'gallery-05.webp', 'Фото из галереи «Новой школы» 5'),
  galleryImageDoc('gallery06', 'gallery-06.webp', 'Фото из галереи «Новой школы» 6'),
  galleryImageDoc('gallery07', 'gallery-07.webp', 'Фото из галереи «Новой школы» 7'),
  galleryImageDoc('gallery08', 'gallery-08.webp', 'Фото из галереи «Новой школы» 8'),
  galleryImageDoc('gallery09', 'gallery-09.webp', 'Фото из галереи «Новой школы» 9'),
  galleryImageDoc('gallery10', 'gallery-10.webp', 'Фото из галереи «Новой школы» 10'),
  galleryImageDoc('gallery11', 'gallery-11.webp', 'Фото из галереи «Новой школы» 11'),
  galleryImageDoc('gallery12', 'gallery-12.webp', 'Фото из галереи «Новой школы» 12'),
  galleryImageDoc('gallery13', 'gallery-13.webp', 'Фото из галереи «Новой школы» 13'),
  galleryImageDoc('gallery14', 'gallery-14.webp', 'Фото из галереи «Новой школы» 14'),
  galleryImageDoc('gallery15', 'gallery-15.webp', 'Фото из галереи «Новой школы» 15'),
  galleryImageDoc('gallery16', 'gallery-16.webp', 'Фото из галереи «Новой школы» 16'),
  galleryImageDoc('gallery17', 'gallery-17.webp', 'Фото из галереи «Новой школы» 17'),
  galleryImageDoc('gallery18', 'gallery-18.webp', 'Фото из галереи «Новой школы» 18'),
  galleryImageDoc('gallery19', 'gallery-19.webp', 'Фото из галереи «Новой школы» 19'),
  galleryImageDoc('gallery20', 'gallery-20.webp', 'Фото из галереи «Новой школы» 20'),
  galleryImageDoc('gallery21', 'gallery-21.webp', 'Фото из галереи «Новой школы» 21'),
  galleryImageDoc('gallery22', 'gallery-22.webp', 'Фото из галереи «Новой школы» 22'),
  galleryImageDoc('gallery23', 'gallery-23.webp', 'Фото из галереи «Новой школы» 23'),
  galleryImageDoc('gallery24', 'gallery-24.webp', 'Фото из галереи «Новой школы» 24'),
  galleryImageDoc('gallery25', 'gallery-25.webp', 'Фото из галереи «Новой школы» 25'),
  galleryImageDoc('gallery26', 'gallery-26.webp', 'Фото из галереи «Новой школы» 26'),
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

function makeHeroMarqueeBlock({
  tagline,
  title = 'Школа, где детям интересно учиться',
  titleEmphasis = 'учиться',
  description = 'Помогаем детям учиться, раскрывать способности и находить свои сильные стороны через занятия, проекты и живое общение',
  primaryButtonLabel,
  primaryButtonLink,
  secondaryButtonLabel,
  secondaryButtonLink,
  images,
}: {
  tagline?: string
  title?: string
  titleEmphasis?: string
  description?: string
  primaryButtonLabel?: string
  primaryButtonLink?: string
  secondaryButtonLabel?: string
  secondaryButtonLink?: string
  images: number[]
}) {
  return {
    blockType: 'heroMarquee',
    tagline: tagline ?? null,
    title,
    titleEmphasis: titleEmphasis ?? null,
    description,
    primaryButtonLabel: primaryButtonLabel ?? null,
    primaryButtonLink: primaryButtonLink ?? null,
    secondaryButtonLabel: secondaryButtonLabel ?? null,
    secondaryButtonLink: secondaryButtonLink ?? null,
    images,
  }
}

function makeTitleDescriptionBlock(title: string, description: string = PLACEHOLDER_TEXT) {
  return {
    blockType: 'titleDescription',
    title,
    description,
  }
}

function makeSchoolLifeBlock() {
  return {
    blockType: 'schoolLife',
    title: 'Новая школа\nэто больше чем учеба',
    description:
      'Дружелюбная атмосфера, праздники, внеклассные мероприятия, разнообразные экскурсии, литературные гостиные и театральные постановки — все для раскрытия талантов каждого ребенка.',
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
    title: '«Новая школа» – это',
    description: null,
    cards: [
      {
        text: 'Просторные современные классы',
        iconName: 'building-2',
        image: null,
      },
      {
        text: 'Профессиональные педагоги по всем предметам',
        iconName: 'graduation-cap',
        image: null,
      },
      {
        text: 'Английский язык с преподавателями Школы английского языка SkillSet',
        iconName: 'languages',
        image: null,
      },
      {
        text: 'Спортивный зал',
        iconName: 'dumbbell',
        image: null,
      },
      {
        text: 'Компьютерный класс',
        iconName: 'monitor',
        image: null,
      },
      {
        text: 'Лаборатория',
        iconName: 'flask-conical',
        image: null,
      },
      {
        text: 'ИЗО-студия и зал для музыкальных занятий',
        iconName: 'palette',
        image: null,
      },
      {
        text: 'Уютная столовая',
        iconName: 'utensils-crossed',
        image: null,
      },
      {
        text: 'Пространства для активных игр и отдыха',
        iconName: 'volleyball',
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
  options: { categoryFilter?: number; cardDesign?: 'default' | 'category'; hideTitle?: boolean } = {},
) {
  return {
    blockType: 'collectionGrid',
    title,
    hideTitle: options.hideTitle ?? false,
    description,
    collectionType,
    itemLimit,
    showViewAllButton,
    viewAllButtonLabel: 'Смотреть все',
    ...(collectionType === 'clubs'
      ? { categoryFilter: options.categoryFilter, cardDesign: options.cardDesign ?? 'default' }
      : {}),
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
  // Seed images are static repo assets that don't change between runs. Once a
  // media doc exists for a given filename/alt we only sync its metadata — we
  // deliberately skip re-sending `filePath`/`overwriteExistingFiles`, since that
  // would make Payload reprocess (resize + reformat) and re-upload every size to
  // R2 on every single seed run, burning through the free-tier operation limits.
  const existingByFilename = await findOneByField(payload, 'media', 'filename', filename)

  if (existingByFilename) {
    return payload.update({
      collection: 'media',
      context: SEED_CONTEXT,
      data: {
        alt,
      },
      id: existingByFilename.id,
      overrideAccess: true,
    })
  }

  const existingByAlt = await findOneByField(payload, 'media', 'alt', alt)

  if (existingByAlt) {
    return payload.update({
      collection: 'media',
      context: SEED_CONTEXT,
      data: {
        alt,
      },
      id: existingByAlt.id,
      overrideAccess: true,
    })
  }

  const created = await payload.create({
    collection: 'media',
    // When restoring a database against a bucket previously filled by this
    // exact seed, Payload still generates the media metadata but the S3 hook
    // does not upload the original or derived image sizes again.
    context: SEED_MEDIA_CONTEXT,
    data: {
      alt,
    },
    filePath,
    overrideAccess: true,
    overwriteExistingFiles: true,
  })

  return created
}

async function seedMedia(payload: Awaited<ReturnType<typeof getPayload>>) {
  if (process.env.SEED_REUSE_S3 === 'true') {
    console.log('Reusing existing S3 seed media without uploads.')
  }

  const allMediaFiles = [
    ...seedMediaFiles,
    ...orgInfoMediaFiles,
    ...programMediaFiles,
    ...teacherMediaFiles,
    ...logoMediaFiles,
    ...galleryMediaFiles,
  ]
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
      slug: 'gruppa-prodlennogo-dnya',
      generateSlug: false,
      title: 'Группа продлённого дня',
      description:
        'Присмотр и занятия для детей после школы: прогулки, горячее питание, помощь с уроками — без гаджетов.',
      previewImage: media.clubGruppaProdlennogoDnya.id,
      isActive: true,
      sortOrder: 4,
    },
    {
      slug: 'podgotovka-k-shkole',
      generateSlug: false,
      title: 'Подготовка к школе',
      description: 'Для дошкольников 5–7 лет: готовим руку к письму, учим читать и считать.',
      previewImage: media.clubPodgotovkaKShkole.id,
      isActive: true,
      sortOrder: 2,
    },
    {
      slug: 'anglijskij',
      generateSlug: false,
      title: 'Школа английского языка',
      description: 'Английский для всех возрастов, включая подготовку к ОГЭ и ЕГЭ.',
      previewImage: media.clubAnglShkolaCover.id,
      isActive: true,
      sortOrder: 1,
    },
    {
      slug: 'aktivnye-kanikuly',
      generateSlug: false,
      title: 'Активные каникулы',
      description: 'Клуб полного дня на каникулах: игры, творчество и английский язык.',
      previewImage: media.clubLetnyayaSmenaPreview.id,
      isActive: true,
      sortOrder: 5,
    },
    {
      slug: 'kruzhki',
      generateSlug: false,
      title: 'Кружки',
      pageTitle: 'Увлечения',
      description: '',
      showProgramMarquee: true,
      previewImage: media.clubHudozhestvennayaStudiya.id,
      isActive: true,
      sortOrder: 3,
    },
    {
      slug: 'shkola',
      generateSlug: false,
      title: 'Школа',
      description:
        'Общеобразовательное обучение с нулевого по одиннадцатый класс по ФГОС через Академическую гимназию.',
      isActive: false,
      sortOrder: 6,
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
      slug: 'gruppa-prodlennogo-dnya',
      generateSlug: false,
      title: 'Группа продлённого дня',
      category: programCategories['gruppa-prodlennogo-dnya'].id,
      shortDescription:
        'По будням с 13:00 до 19:00: прогулки на свежем воздухе, полдник и полноценный ужин, помощь с домашним заданием, чтение и игры — интересный день в дружественной среде с выполненными уроками и без гаджетов.',
      previewImage: media.clubGruppaProdlennogoDnya.id,
      coverImage: media.clubGruppaProdlennogoDnya.id,
      coverImagePosition: 'top',
      tabs: [
        {
          title: 'Описание',
          icon: 'book-open',
          content: makeRichTextMixed([
            {
              type: 'paragraph',
              text: 'По будням с 13:00 до 19:00 в группе продлённого дня мы гуляем на свежем воздухе с активными играми, полноценно кормим — полдник и ужин, помогаем сделать домашние задания, читаем и играем.',
            },
            { type: 'paragraph', text: 'Кроме того:' },
            {
              type: 'list',
              items: [
                'Педагог-воспитатель на каждые 8 детей.',
                'Лагерь по льготной цене на всех промежуточных каникулах.',
                'Английский язык по льготной цене от Школы английского языка SkillSet.',
              ],
            },
            {
              type: 'paragraph',
              text: 'Интересный день в дружественной среде с выполненными уроками и без гаджетов!',
            },
          ]),
          layout: [
            {
              blockType: 'audience',
              title: 'Для кого подходит группа продлённого дня',
              text: 'Программа подходит семьям, которым нужен присмотр за ребёнком после школы и помощь с уроками, пока родители заняты до вечера.',
              hideHeader: false,
              items: [
                {
                  title: 'Дети школьного возраста',
                  text: 'Забираем из школы с 12:00, а привести ребёнка родители могут самостоятельно с 13:00.',
                },
                {
                  title: 'Родители, занятые до вечера',
                  text: 'Ребёнок под присмотром педагога-воспитателя до 19:00, с сделанными уроками и горячим питанием.',
                },
                {
                  title: 'Семьи, которым важен режим без гаджетов',
                  text: 'Прогулки, чтение, творчество и живое общение вместо экрана телефона или планшета.',
                },
              ],
            },
          ],
        },
        {
          title: 'Расписание',
          icon: 'calendar-days',
          layout: [
            {
              blockType: 'schedule',
              title: 'Распорядок дня',
              hideTitle: true,
              description: 'Пн–Пт, с 12:00 до 19:00.',
              scheduleItems: [
                { label: '12:00–13:00', value: 'Забираем детей из школы (привести ребёнка родители могут самостоятельно с 13:00)' },
                { label: '13:00–13:30', value: 'Выполнение домашнего задания' },
                { label: '13:30–14:00', value: 'Перекус, игры' },
                { label: '14:00–15:30', value: 'Выполнение домашнего задания, игры' },
                { label: '15:30–16:30', value: 'Прогулка' },
                { label: '16:30–17:00', value: 'Ужин' },
                { label: '17:00–17:20', value: 'Самостоятельное чтение' },
                { label: '17:20–18:20', value: 'Творчество, фитнес (по расписанию)' },
                { label: '18:20–19:00', value: 'Свободное время (настольные игры, чтение и т.п.), разбор детей' },
              ],
            },
          ],
        },
        {
          title: 'Стоимость',
          icon: 'wallet',
          content: makeRichTextMixed([
            {
              type: 'paragraph',
              text: 'Стоимость группы продлённого дня уточняйте у администратора по телефону или оставив заявку — рассчитаем её в зависимости от графика посещения.',
            },
            {
              type: 'list',
              items: [
                'В стоимость включено: присмотр педагога-воспитателя (1 на 8 детей), помощь с домашним заданием, полдник и полноценный ужин.',
                'Льготная цена на лагерь во все промежуточные каникулы для детей группы продлённого дня.',
                'Английский язык по льготной цене от Школы английского языка SkillSet.',
              ],
            },
          ]),
        },
      ],
      isActive: true,
      sortOrder: 14,
    },
    {
      slug: 'kulinariya',
      generateSlug: false,
      title: 'Кулинария',
      shortDescription: 'Мастер-классы по кулинарии для детей с 8 лет: готовим блюда и десерты.',
      category: programCategories.kruzhki.id,
      previewImage: media.clubKulinariya.id,
      coverImage: media.clubKulinariya.id,
      tabs: [
        {
          title: 'Описание',
          icon: 'book-open',
          content: makeRichText([
            'Дети обожают готовить! А времени на готовку с детьми часто не хватает. Наши мастер-классы по кулинарии — это то, чего не хватает сегодняшним детям: развитие практического жизненно необходимого навыка с огромным удовольствием.',
            'Занятия по кулинарии проводятся блоками по 4 занятия. В каждом блоке мы учимся не только печь тортики и печенье, но и готовить повседневные блюда, знакомимся с правилами правильного питания и технологией приготовления блюд, осваиваем новые простые и сложные рецепты, которые можно повторить дома.',
          ]),
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
        {
          title: 'Расписание',
          icon: 'calendar-days',
          layout: [
            {
              blockType: 'schedule',
              title: 'Расписание занятий',
              description: 'Занятия проводятся блоками по 4 занятия.',
              scheduleItems: [
                { label: 'Дни занятий', value: 'Вторник, Четверг' },
                { label: 'Время', value: '15:00–16:00' },
                { label: 'Формат', value: 'Блоки по 4 занятия' },
                { label: 'Возраст', value: 'От 8 лет' },
              ],
              viewAllLink: '/programs/raspisanie-kruzhkov',
            },
          ],
        },
        {
          title: 'Стоимость',
          icon: 'wallet',
          content: makeRichText([
            'Стоимость кружка «Кулинария» зависит от количества занятий в выбранном блоке. Актуальный прайс-лист, расписание групп и наличие мест уточняйте у администратора школы.',
          ]),
        },
      ],
      isActive: true,
      sortOrder: 4,
    },
    {
      slug: 'rukodelie',
      generateSlug: false,
      title: 'Рукоделие',
      shortDescription: 'Вязание, вышивка, бисероплетение и макраме для детей с 6 лет.',
      category: programCategories.kruzhki.id,
      previewImage: media.clubRukodelie.id,
      coverImage: media.clubRukodelie.id,
      tabs: [
        {
          title: 'Описание',
          icon: 'book-open',
          content: makeRichText([
            'Вязание крючком и спицами, вышивка, бисероплетение, плетение шнуров-поясов, макраме и множество других навыков, незаслуженно забытых, снова входят в моду и являются лучшим лекарством от дефицита внимания, свойственного современным детям.',
            'Мы возвращаем в жизнь детей подарки, сделанные своими руками: игрушку-брелок, пояс, чехол для телефона, сумку-несессер, корзинку для мелочей и многое другое, сделанное вручную.',
          ]),
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
        {
          title: 'Расписание',
          icon: 'calendar-days',
          layout: [
            {
              blockType: 'schedule',
              title: 'Расписание занятий',
              hideHeader: true,
              scheduleItems: [
                { label: 'Дни занятий', value: 'Понедельник, Среда' },
                { label: 'Время', value: '16:00–16:45' },
              ],
              viewAllLink: '/programs/raspisanie-kruzhkov',
            },
          ],
        },
        {
          title: 'Стоимость',
          icon: 'wallet',
          content: makeRichText([
            'Стоимость кружка «Рукоделие» и наличие свободных мест в группах уточняйте у администратора школы.',
          ]),
        },
      ],
      isActive: true,
      sortOrder: 5,
    },
    {
      slug: 'hudozhestvennaya-studiya',
      generateSlug: false,
      title: 'Художественная студия',
      shortDescription: 'Рисуем и лепим, знакомясь с творчеством известных художников.',
      category: programCategories.kruzhki.id,
      previewImage: media.clubHudozhestvennayaStudiya.id,
      coverImage: media.clubHudozhestvennayaStudiya.id,
      tabs: [
        {
          title: 'Описание',
          icon: 'book-open',
          content: makeRichText([
            'Изучение мировой художественной культуры на практических занятиях: не просто учить живописи и скульптуре, но и просвещать, формировать общий кругозор в сфере искусства — главная задача нашей студии.',
            'В «Новой школе» детям рассказывают о художнике, показывают его картины, обсуждают их, формируя художественную насмотренность, а затем предлагают нарисовать картину в стиле этого художника. Даже если ребёнок не свяжет свою жизнь с искусством, он будет в нём разбираться и сможет поддержать беседу.',
            'Мы изучаем художественные стили, воплощая их в живописных и скульптурных работах — от народного творчества до современных направлений в живописи и скульптуре.',
          ]),
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
        {
          title: 'Расписание',
          icon: 'calendar-days',
          layout: [
            {
              blockType: 'schedule',
              title: 'Расписание занятий',
              description: 'Отдельные группы для детей и взрослых.',
              scheduleItems: [
                { label: 'Для детей', value: 'Пятница, 11:00–12:00' },
                { label: 'Для взрослых', value: 'Суббота, 11:00–12:00' },
              ],
              viewAllLink: '/programs/raspisanie-kruzhkov',
            },
          ],
        },
        {
          title: 'Стоимость',
          icon: 'wallet',
          content: makeRichText([
            'Стоимость занятий в художественной студии для детей и взрослых уточняйте у администратора школы.',
          ]),
        },
      ],
      isActive: true,
      sortOrder: 2,
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
      tabs: [
        {
          title: 'Описание',
          icon: 'book-open',
          content: makeRichText([
            'Театральная студия — это мир фантазии, ярких образов, огромных возможностей для актёрского перевоплощения. Программа занятий включает такие направления, как актёрское мастерство, сценическое движение, сценическая речь и другие.',
            'Занятия актёрским мастерством помогают развивать коммуникативные навыки, эмоциональный интеллект, творческие навыки, уверенность в себе, концентрацию и память.',
            'Неоценима и воспитательная роль театрализованной деятельности. Она учит доброте, чуткости, честности, смелости, формирует понятия добра и зла. Робкому ребёнку игра поможет стать более смелым и решительным, застенчивому — преодолеть неуверенность в себе.',
          ]),
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
        {
          title: 'Расписание',
          icon: 'calendar-days',
          layout: [
            {
              blockType: 'schedule',
              title: 'Расписание занятий',
              hideHeader: true,
              scheduleItems: [
                { label: 'Дни занятий', value: 'Понедельник, Четверг' },
                { label: 'Время', value: '17:00–18:00' },
              ],
              viewAllLink: '/programs/raspisanie-kruzhkov',
            },
          ],
        },
        {
          title: 'Стоимость',
          icon: 'wallet',
          content: makeRichText([
            'Стоимость занятий в музыкально-театральной студии и наличие мест в группах уточняйте у администратора школы.',
          ]),
        },
      ],
      isActive: true,
      sortOrder: 3,
    },
    {
      slug: 'krasivoe-pismo',
      generateSlug: false,
      title: 'Красивое письмо',
      shortDescription: 'Искусство красивого письма для детей с 7 лет: почерк и скорость письма.',
      category: programCategories.kruzhki.id,
      previewImage: media.clubKrasivoePismo.id,
      coverImage: media.clubKrasivoePismo.id,
      tabs: [
        {
          title: 'Описание',
          icon: 'book-open',
          content: makeRichTextMixed([
            {
              type: 'paragraph',
              text: 'Каллиграфия — искусство красивого письма, в котором отражена целостность отдельных букв и всего текста, его гармоничность, форма и ритм.',
            },
            {
              type: 'paragraph',
              text: 'Чистописание — это искусство аккуратного письма, правила письма и соединений. По сути, это две части одного целого: чистописание помогает писать аккуратно и быстро, а каллиграфия — это творчество, стиль, эстетика. Для школьников начать стоит с чистописания — формирования аккуратного и разборчивого почерка, что положительно скажется не только на успеваемости, но и на самооценке ребёнка.',
            },
            { type: 'paragraph', text: 'Чем полезна каллиграфия:' },
            {
              type: 'list',
              items: [
                'Аккуратный разборчивый почерк.',
                'Высокая скорость письма.',
                'Внимательность к деталям.',
                'Красота письма и грамотность.',
                'Развитие мышления и памяти в целом.',
              ],
            },
          ]),
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
        {
          title: 'Расписание',
          icon: 'calendar-days',
          layout: [
            {
              blockType: 'schedule',
              title: 'Расписание занятий',
              hideHeader: true,
              scheduleItems: [
                { label: 'Дни занятий', value: 'Вторник, Воскресенье' },
                { label: 'Время', value: '16:30–17:15' },
              ],
              viewAllLink: '/programs/raspisanie-kruzhkov',
            },
          ],
        },
        {
          title: 'Стоимость',
          icon: 'wallet',
          content: makeRichText([
            'Стоимость кружка «Красивое письмо» и наличие свободных мест в группах уточняйте у администратора школы.',
          ]),
        },
      ],
      isActive: true,
      sortOrder: 1,
    },
    {
      slug: 'mentalnaya-arifmetika',
      generateSlug: false,
      title: 'Ментальная арифметика',
      shortDescription: 'Устный счёт и развитие двухполушарного мышления для детей от 5 до 16 лет.',
      category: programCategories.kruzhki.id,
      previewImage: media.clubMentalnayaArifmetika.id,
      coverImage: media.clubMentalnayaArifmetika.id,
      tabs: [
        {
          title: 'Описание',
          icon: 'book-open',
          content: makeRichTextMixed([
            {
              type: 'paragraph',
              text: 'Ментальная арифметика — это методика, активно способствующая интеллектуальному развитию детей, повышающая умственные способности и творческий потенциал за счёт устных арифметических вычислений и развития двухполушарного мышления.',
            },
            { type: 'paragraph', text: 'Что развивают занятия:' },
            {
              type: 'list',
              items: [
                'Воображение.',
                'Творческие способности.',
                'Быстроту реакции.',
                'Нестандартный подход к любой ситуации.',
                'Креативность.',
                'Лидерские качества.',
                'Усидчивость и внимательность.',
                'Память.',
                'Интерес к изучению других дисциплин.',
                'Быстрый счёт в уме.',
              ],
            },
          ]),
          layout: [
            {
              blockType: 'audience',
              title: 'Для кого подходит кружок',
              text: 'Кружок подходит дошкольникам и школьникам, которые хотят научиться быстро считать в уме.',
              hideHeader: true,
              items: [
                {
                  title: 'Для детей от 5 до 16 лет',
                  text: 'Развивают устный счёт, память, внимательность и творческое мышление на регулярных занятиях.',
                },
              ],
            },
          ],
        },
        {
          title: 'Расписание',
          icon: 'calendar-days',
          layout: [
            {
              blockType: 'schedule',
              title: 'Расписание занятий',
              hideHeader: true,
              scheduleItems: [
                { label: 'Дни занятий', value: 'Среда, Воскресенье' },
                { label: 'Время', value: '15:30–16:30' },
              ],
              viewAllLink: '/programs/raspisanie-kruzhkov',
            },
          ],
        },
        {
          title: 'Стоимость',
          icon: 'wallet',
          content: makeRichText([
            'Стоимость кружка «Ментальная арифметика» и наличие свободных мест в группах уточняйте у администратора школы.',
          ]),
        },
      ],
      isActive: true,
      sortOrder: 6,
    },
    {
      slug: 'raspisanie-kruzhkov',
      generateSlug: false,
      title: 'Расписание',
      shortDescription: 'Все кружки по дням недели — выберите день, чтобы увидеть, какие занятия проходят.',
      category: programCategories.kruzhki.id,
      useTabsNavigation: true,
      // Вкладки по дням недели заполняются ниже, после того как созданы все
      // кружки — строки расписания ссылаются на их id (см. seedScheduleTabs).
      tabs: [],
      isActive: true,
      sortOrder: 0,
    },
    {
      slug: 'anglijskij-dlya-doshkolnikov',
      generateSlug: false,
      title: 'Английский для дошкольников',
      shortDescription: 'Английский для детей 4–6 лет: разговорная речь и подготовка к чтению.',
      category: programCategories.anglijskij.id,
      previewImage: media.clubAnglDoshkolniki.id,
      coverImage: media.clubAnglDoshkolniki.id,
      coverImagePosition: 'center',
      tabs: [
        {
          title: 'Описание',
          icon: 'book-open',
          content: makeRichText([
            'Занятия ведут преподаватели с международной квалификацией TKT: Young Learners. Программа учитывает возрастные преимущества восприятия английского языка и психологические особенности дошкольников, поэтому дети занимаются с удовольствием и без напряжения.',
            'Группы формируются по возрасту и уже имеющемуся уровню английского языка — так каждому ребёнку комфортно заниматься в своём темпе.',
            'Основной акцент — на развитии восприятия речи на слух и разговорных навыках: ребёнок учится понимать простую английскую речь и говорить простыми фразами, а также готовится к дальнейшему обучению чтению на английском.',
          ]),
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
        {
          title: 'Расписание',
          icon: 'calendar-days',
          layout: [
            {
              blockType: 'schedule',
              title: 'Расписание занятий',
              description: 'Группы формируются по возрасту и уровню английского языка.',
              scheduleItems: [
                { label: 'Возраст', value: '4–6 лет' },
                { label: 'Преподаватели', value: 'С международной квалификацией TKT: Young Learners' },
              ],
            },
          ],
        },
        {
          title: 'Стоимость',
          icon: 'wallet',
          content: makeRichText([
            'Стоимость занятий английским для дошкольников и наличие мест в группах уточняйте у администратора школы.',
          ]),
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
      coverImagePosition: 'top',
      tabs: [
        {
          title: 'Описание',
          icon: 'book-open',
          content: makeRichText([
            'Занятия ведут преподаватели с педагогическим образованием или международным сертификатом, подтверждающим право преподавания английского языка, с уровнем владения языком Advanced и выше.',
            'Развиваем грамотную разговорную речь, восприятие речи на слух, чтение и письмо — программа учитывает возрастные особенности восприятия языка. По итогам обучения и успешной итоговой аттестации ученик получает сертификат.',
          ]),
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
        {
          title: 'Расписание',
          icon: 'calendar-days',
          layout: [
            {
              blockType: 'schedule',
              title: 'Расписание занятий',
              description: 'Группы формируются по возрасту учеников и уровню владения английским языком.',
              scheduleItems: [
                { label: 'Периодичность', value: '2 раза в неделю по 80 минут' },
                { label: 'Период', value: 'С сентября по май' },
                { label: 'Размер группы', value: 'До 8 человек' },
              ],
            },
          ],
        },
        {
          title: 'Стоимость',
          icon: 'wallet',
          content: makeRichText([
            'Стоимость занятий английским для школьников и наличие мест в группах уточняйте у администратора школы.',
          ]),
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
      coverImagePosition: 'bottom',
      tabs: [
        {
          title: 'Описание',
          icon: 'book-open',
          content: makeRichText([
            'Программа подготовки построена в соответствии с федеральными образовательными стандартами базового и углублённого уровня — такой формат позволяет уделить внимание разбору сложных тем и типичных ошибок каждого ученика.',
            'Мы делаем ставку на комплексное развитие всех аспектов языка, необходимых для экзамена: грамматики, аудирования, чтения, письма и говорения. 86% наших учеников, сдававших ЕГЭ по английскому языку, получили более 80 баллов. По итогам курса выдаётся сертификат.',
          ]),
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
        {
          title: 'Расписание',
          icon: 'calendar-days',
          layout: [
            {
              blockType: 'schedule',
              title: 'Расписание занятий',
              description: 'Мини-группы для внимания к каждому ученику.',
              scheduleItems: [
                { label: 'Размер группы', value: 'До 4 человек' },
                { label: 'Длительность занятия', value: '90 минут' },
                { label: 'Период', value: 'С сентября по май' },
              ],
            },
          ],
        },
        {
          title: 'Стоимость',
          icon: 'wallet',
          content: makeRichText([
            'Стоимость подготовки к ЕГЭ и ОГЭ по английскому языку и наличие мест в мини-группах уточняйте у администратора школы.',
          ]),
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
      tabs: [
        {
          title: 'Описание',
          icon: 'book-open',
          content: makeRichText([
            'Зачисление в группу проходит по результатам тестирования — так каждый занимается на своём уровне. Занятия ведут преподаватели с педагогическим образованием или международным сертификатом и уровнем владения языком Advanced и выше.',
            'Используем коммуникативную методику: говорить по-английски мы начинаем уже на первом занятии. Развиваем грамотную разговорную речь, восприятие речи на слух, чтение и письмо, но в приоритете — именно живое общение. Свои учебные пособия студенты приобретают самостоятельно.',
          ]),
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
        {
          title: 'Расписание',
          icon: 'calendar-days',
          layout: [
            {
              blockType: 'schedule',
              title: 'Расписание занятий',
              description: 'Зачисление в группу — по результатам тестирования.',
              scheduleItems: [
                { label: 'Период', value: 'С сентября по май' },
                { label: 'Размер группы', value: 'До 10 человек' },
                { label: 'Длительность занятия', value: '100 минут' },
              ],
            },
          ],
        },
        {
          title: 'Стоимость',
          icon: 'wallet',
          content: makeRichText([
            'Стоимость занятий английским для взрослых и наличие мест в группах уточняйте у администратора школы. Учебные пособия студенты приобретают самостоятельно.',
          ]),
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
      previewImage: media.clubAnglIndividualnye.id,
      coverImage: media.clubAnglIndividualnye.id,
      coverImagePosition: 'bottom',
      tabs: [
        {
          title: 'Описание',
          icon: 'book-open',
          content: makeRichText([
            'Индивидуальные занятия подходят ученикам любого возраста — от дошкольников до взрослых — которым важен личный темп и содержание курса, полностью подстроенное под их задачу. Преподавателя подбираем с учётом возраста и уровня ученика.',
            'Формат хорошо дополняет групповые программы «Новой школы» или полностью заменяет их, если ребёнку или взрослому нужно более пристальное внимание преподавателя.',
            'Перед началом занятий определяем текущий уровень и цель: помощь со школьной программой, подготовка к ОГЭ или ЕГЭ, разговорный английский для путешествий или общения, деловой английский. Исходя из этого преподаватель составляет личный план занятий и корректирует его по ходу обучения.',
          ]),
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
        {
          title: 'Расписание',
          icon: 'calendar-days',
          content: makeRichText([
            'Расписание индивидуальных занятий согласовывается лично с преподавателем и подстраивается под ваш график — уточняйте свободные слоты у администратора.',
          ]),
        },
        {
          title: 'Стоимость',
          icon: 'wallet',
          content: makeRichText([
            'Стоимость индивидуальных занятий английским зависит от уровня преподавателя и выбранной программы — точную цену уточняйте у администратора школы.',
          ]),
        },
      ],
      isActive: true,
      sortOrder: 10,
    },
    {
      slug: 'anglijskij-na-kanikulah',
      generateSlug: false,
      title: 'Английский на каникулах',
      shortDescription: 'Английский в каникулярных сменах «Новой школы» — смотрите программы каникул.',
      category: programCategories.anglijskij.id,
      linkToCategory: programCategories['aktivnye-kanikuly'].id,
      previewImage: media.clubLetnyayaSmenaPreview.id,
      coverImage: media.clubLetnyayaSmenaPreview.id,
      isActive: true,
      sortOrder: 11,
    },
    {
      slug: 'letnie-smeny-s-anglijskim',
      generateSlug: false,
      title: 'Летние смены с английским',
      shortDescription: 'Летний клуб полного дня для детей 7–12 лет: игры, творчество и английский язык.',
      category: programCategories['aktivnye-kanikuly'].id,
      previewImage: media.clubLetnyayaSmenaPreview.id,
      coverImage: media.clubLetnyayaSmenaCover.id,
      tabs: [
        {
          title: 'Описание',
          icon: 'book-open',
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
          icon: 'calendar-days',
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
          icon: 'wallet',
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
      coverImage: null,
      tabs: [
        {
          title: 'Описание',
          icon: 'book-open',
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
          icon: 'calendar-days',
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
          icon: 'wallet',
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
      tabs: [
        {
          title: 'Описание',
          icon: 'book-open',
          content: makeRichTextMixed([
            {
              type: 'paragraph',
              text: '«Нулевой» класс в «Новой школе» — это игра «в школу» не понарошку: качественная подготовка и адаптация к школьному распорядку для тех, кому уже не интересно в саду, а в школу пока рано. Дети привыкают сидеть за партами, не забывая поиграть на ковре, — а вместо тихого часа их ждёт насыщенный день с английским языком, математикой, чтением и творчеством.',
            },
            {
              type: 'paragraph',
              text: 'Есть и компактный формат — интенсив для тех, кто не готов к полному дню: математика, чтение, подготовка руки к письму и развитие речи в формате школьных уроков и переменок. У интенсива два варианта — короткий летний курс перед 1 сентября и базовый курс на весь учебный год.',
            },
          ]),
          layout: [
            {
              blockType: 'audience',
              title: 'Для кого подходит программа',
              text: 'Полный «нулевой» класс или компактный интенсив — оба формата готовят к школе, но по-разному подходят под расписание семьи.',
              hideHeader: false,
              items: [
                {
                  title: 'Дети 5–7 лет',
                  text: 'Которые собираются в 1-й класс в следующем учебном году и которым нужна полноценная подготовка к школе — «нулевой» класс на полный день.',
                },
                {
                  title: 'Будущие первоклассники',
                  text: 'Дети, которые в сентябре идут в 1-й класс, — для них летний интенсив за 4 недели до школы.',
                },
                {
                  title: 'Родители',
                  text: 'Которые хотят, чтобы ребёнок привык к партам, урокам и переменам заранее, а не с первого сентября.',
                },
              ],
            },
            {
              blockType: 'program',
              title: 'Что входит в «нулевой» класс',
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
              blockType: 'program',
              title: 'Что входит в интенсив',
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
          ],
        },
        {
          title: 'Расписание',
          icon: 'calendar-days',
          layout: [
            {
              blockType: 'schedule',
              title: 'Расписание «0-й класс»',
              description: 'Полный учебный день по будням.',
              scheduleItems: [
                { label: 'Дни недели', value: 'Пн–Пт' },
                { label: 'Время', value: '8:30–15:30' },
                { label: 'Размер группы', value: 'До 8 детей' },
              ],
            },
            {
              blockType: 'schedule',
              title: 'Расписание «Интенсив»',
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
        {
          title: 'Стоимость',
          icon: 'wallet',
          content: makeRichText([
            'Стоимость подготовки к школе зависит от выбранного формата — «нулевой» класс на полный день или компактный интенсив. Точную цену и наличие мест уточняйте у администратора школы.',
          ]),
        },
      ],
      isActive: true,
      sortOrder: 13,
    },
    {
      slug: 'nulevoy-klass',
      generateSlug: false,
      title: 'Нулевой класс',
      category: programCategories['shkola'].id,
      shortDescription:
        'Игра «в школу» не понарошку: адаптация к школе, английский язык, математика, чтение и творчество — для тех, кому ещё рано в 1-й класс.',
      previewImage: media.clubNulevoyKlass.id,
      coverImage: media.clubNulevoyKlass.id,
      coverImagePosition: 'top',
      tabs: [
        {
          title: 'Описание',
          icon: 'book-open',
          content: makeRichText([
            'Нулевой класс в «Новой школе» — игра «в школу» не понарошку: качественная подготовка и адаптация к школе для тех, кому уже не интересно в саду, а в школу раньше точно не хочется.',
          ]),
          layout: [
            {
              blockType: 'audience',
              title: 'Для кого подходит нулевой класс',
              text: 'Мягкий переход от сада к школе — с сохранением игры и большим вниманием к каждому ребёнку.',
              hideHeader: false,
              items: [
                {
                  title: 'Для тех, кому скучно в саду',
                  text: 'Качественная подготовка и адаптация к школе для тех, кому не интересно в саду, а в школу раньше точно не хочется.',
                  icon: 'baby',
                },
                {
                  title: 'Для непосед',
                  text: 'Можно не спать: привыкаем сидеть за партами, не забывая поиграть на ковре.',
                  icon: 'sparkles',
                },
                {
                  title: 'Для занятых родителей',
                  text: 'По будням с 8:30 до 17:00, а до 19:00 можно оставить ребёнка в группе продлённого дня.',
                  icon: 'clock',
                },
              ],
            },
            {
              blockType: 'program',
              title: 'Что входит в нулевой класс',
              description: 'Каждый день — уроки и переменки, как в школе, а вокруг основных предметов — творчество, музыка, спорт и вкусное питание.',
              items: [
                {
                  title: 'Английский язык',
                  text: 'С лучшими преподавателями Школы английского языка SkillSet.',
                  icon: 'languages',
                },
                {
                  title: 'Математика, чтение и письмо',
                  text: 'Развитие речи и подготовка руки к письму в игровой форме.',
                  icon: 'pen-tool',
                },
                {
                  title: 'Творчество и игровая деятельность',
                  text: 'Много творчества и развивающей игровой деятельности между занятиями.',
                  icon: 'palette',
                },
                {
                  title: 'Музыка, ИЗО, физкультура, шахматы',
                  text: 'Дополнительные занятия по всем направлениям.',
                  icon: 'music',
                },
                {
                  title: 'Питание',
                  text: 'Вкусное и здоровое свежеприготовленное питание, соответствующее нормам СанПиНа.',
                  icon: 'utensils',
                },
                {
                  title: 'Небольшой класс',
                  text: 'До 12 детей — внимание к каждому ребёнку.',
                  icon: 'users',
                },
              ],
            },
          ],
        },
        {
          title: 'Расписание',
          icon: 'calendar-days',
          layout: [
            {
              blockType: 'schedule',
              title: 'Основные занятия',
              description: 'Пн–Пт, с 8:30 до 17:00.',
              scheduleItems: [
                {
                  label: '9:00–14:10',
                  value:
                    'Занятия по школьному расписанию с переменами и перерывами на завтрак (9:40), перекус (10:35), обед (12:15)',
                },
                {
                  label: '14:10–15:30',
                  value:
                    'Перекус и свободные игры с воспитателями (2 раза в неделю в это время — занятия по обучению игре в шахматы)',
                },
                { label: '15:30–16:30', value: 'Прогулка' },
                { label: '16:30', value: 'Ужин' },
                { label: '16:45–17:00', value: 'Время чтения' },
              ],
            },
            {
              blockType: 'schedule',
              title: 'В группе продлённого дня',
              description: 'С 17:00 до 19:00 работает группа продлённого дня.',
              scheduleItems: [
                { label: '17:00–18:00', value: 'Творческое занятие' },
                {
                  label: '18:00–19:00',
                  value:
                    'Самостоятельное творчество и игры по интересам (термо- и алмазная мозаика, рисование, сборка Лего, Бабашки (деревянный конструктор), настольные игры и т. п.)',
                },
              ],
            },
          ],
        },
        {
          title: 'Стоимость',
          icon: 'wallet',
          content: makeRichTextMixed([
            {
              type: 'paragraph',
              text: 'Стоимость одного месяца обучения и сопровождения ребёнка составляет 53 000 рублей (включая питание и все занятия по расписанию до 17:00).',
            },
            {
              type: 'paragraph',
              text: 'Также в «Новой школе» есть ежегодный организационный взнос в размере 53 000 рублей, который идёт на приобретение всех учебных пособий и материалов для занятий, проведение праздников, организацию экскурсий (8–9 в год).',
            },
            {
              type: 'paragraph',
              text: 'Возможна оплата образовательной части договора материнским капиталом, а также получение вычета по НДФЛ.',
            },
          ]),
        },
        {
          title: 'Условия приёма',
          icon: 'heart-handshake',
          layout: [
            {
              blockType: 'program',
              title: 'Как поступить',
              description: 'Два простых шага, чтобы ребёнок стал учеником «Новой школы».',
              items: [
                {
                  title: 'Встреча с директором',
                  text: 'Встреча родителей с директором и экскурсия по школе. Записаться можно через заявку на сайте, по телефону +7 925 292-40-96 или сообщением на этот номер в любом мессенджере.',
                },
                {
                  title: 'Пробные дни',
                  text: 'Бесплатные пробные дни (2–3 дня) — чтобы ребёнок познакомился со школой, а школа с ребёнком. На пробных днях мы проводим тестирование детей в учебной обстановке, а по его результатам заключаем договор.',
                },
              ],
            },
          ],
        },
      ],
      isActive: true,
      sortOrder: 0,
    },
    {
      slug: 'nachalnye-klassy',
      generateSlug: false,
      title: 'Начальные классы',
      category: programCategories['shkola'].id,
      shortDescription:
        'Классы с 1 по 4: математика, чтение, английский по аутентичным учебникам, творчество и аттестация через Академическую гимназию.',
      previewImage: media.clubNachalnyeKlassy.id,
      coverImage: media.clubNachalnyeKlassy.id,
      coverImagePosition: 'top',
      tabs: [
        {
          title: 'Описание',
          icon: 'book-open',
          content: makeRichText([
            'Начальные классы — один из важнейших этапов образования ребёнка: не только знания и базовые навыки (чтение, счёт, письмо), но и личность, самостоятельность, социальные навыки и умение учиться.',
          ]),
          layout: [
            {
              blockType: 'audience',
              title: 'Для кого подходят начальные классы',
              text: 'Разностороннее развитие и структурированная программа с государственной аттестацией.',
              hideHeader: false,
              items: [
                {
                  title: 'Для учеников 1–4 классов',
                  text: 'Полная общеобразовательная программа с аттестацией через Академическую гимназию, которая ведёт личные дела детей и переводит в следующий класс.',
                  icon: 'graduation-cap',
                },
                {
                  title: 'Для разностороннего развития',
                  text: 'Качественное умственное, творческое и физическое развитие, определение сферы интересов и выявление сильных сторон ребёнка.',
                  icon: 'sparkles',
                },
                {
                  title: 'Для насыщенной школьной жизни',
                  text: 'Тематические недели, фестивали, праздники, экскурсии и ярмарки — интересное время без гаджетов.',
                  icon: 'party-popper',
                },
              ],
            },
            {
              blockType: 'program',
              title: 'Что входит в программу начальной школы',
              description: 'Крепкая база по основным предметам и разностороннее развитие в расписании занятий.',
              items: [
                {
                  title: 'Математика и русский язык',
                  text: 'С чистописанием — крепкая база по основным предметам.',
                  icon: 'calculator',
                },
                {
                  title: 'Английский язык и чтение',
                  text: 'По аутентичным учебникам, а также чтение хорошей литературы.',
                  icon: 'languages',
                },
                {
                  title: 'Музыка и театр',
                  text: 'Шумовой оркестр и театральные постановки.',
                  icon: 'music',
                },
                {
                  title: 'Рисование',
                  text: 'С изучением основ мировой художественной культуры.',
                  icon: 'palette',
                },
                {
                  title: 'Физкультура и прогулки',
                  text: 'ОФП и активные прогулки в расписании занятий.',
                  icon: 'compass',
                },
              ],
            },
          ],
        },
        {
          title: 'Расписание',
          icon: 'calendar-days',
          layout: [
            {
              blockType: 'schedule',
              title: 'Основные занятия',
              description:
                'Пн–Пт, с 8:30 до 15:30 (1-й класс — до 17:00), далее до 19:00 можно оставить ребёнка в группе продлённого дня.',
              scheduleItems: [
                {
                  label: '9:00–14:10',
                  value:
                    'Занятия по школьному расписанию с переменами и перерывами на завтрак (9:40), перекус (10:35), обед (12:15)',
                },
                {
                  label: '14:10–15:30',
                  value:
                    'Перекус, затем шахматы и самоподготовка (организация выполнения домашнего задания), далее свободные игры',
                },
              ],
            },
            {
              blockType: 'schedule',
              title: 'В группе продлённого дня',
              description: 'С 15:30 до 19:00 работает группа продлённого дня.',
              scheduleItems: [
                { label: '15:30–16:30', value: 'Прогулка' },
                { label: '16:30', value: 'Ужин' },
                { label: '16:45–17:00', value: 'Время чтения' },
                { label: '17:00–18:00', value: 'Творческое занятие' },
                {
                  label: '18:00–19:00',
                  value:
                    'Самостоятельное творчество и игры по интересам (термо- и алмазная мозаика, рисование, сборка Лего, Бабашки (деревянный конструктор), настольные игры и т. п.)',
                },
              ],
            },
          ],
        },
        {
          title: 'Стоимость',
          icon: 'wallet',
          content: makeRichTextMixed([
            {
              type: 'paragraph',
              text: 'Стоимость одного месяца обучения и сопровождения ребёнка составляет 53 000 рублей (включая питание и все занятия по расписанию до 15:30). После 15:30 (17:00 для первоклассников) для наших учеников 1 час пребывания в ГПД стоит 250 рублей.',
            },
            {
              type: 'paragraph',
              text: 'Также в «Новой школе» есть ежегодный организационный взнос в размере 53 000 рублей, который идёт на приобретение всех учебных пособий и материалов для занятий, проведение праздников, организацию экскурсий (8–9 в год).',
            },
            {
              type: 'paragraph',
              text: 'Возможна оплата образовательной части договора материнским капиталом, а также получение вычета по НДФЛ.',
            },
          ]),
        },
        {
          title: 'Условия приёма',
          icon: 'heart-handshake',
          layout: [
            {
              blockType: 'program',
              title: 'Как поступить',
              description: 'Два простых шага, чтобы ребёнок стал учеником «Новой школы».',
              items: [
                {
                  title: 'Встреча с директором',
                  text: 'Встреча родителей с директором и экскурсия по школе. Записаться можно через заявку на сайте, по телефону +7 925 292-40-96 или сообщением на этот номер в любом мессенджере.',
                },
                {
                  title: 'Пробные дни',
                  text: 'Бесплатные пробные дни (2–3 дня) — чтобы ребёнок познакомился со школой, а школа с ребёнком. На пробных днях мы проводим тестирование детей в учебной обстановке, а по его результатам заключаем договор.',
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
      slug: 'srednyaya-shkola',
      generateSlug: false,
      title: 'Средняя школа',
      category: programCategories['shkola'].id,
      shortDescription:
        'Классы с 5 по 8: естественно-научные и гуманитарные направления, углублённая подготовка по базовым предметам.',
      previewImage: media.clubSrednyayaShkola.id,
      coverImage: media.clubSrednyayaShkola.id,
      coverImagePosition: 'center',
      tabs: [
        {
          title: 'Описание',
          icon: 'book-open',
          content: makeRichText([
            'В средней школе с 5-го по 8-й классы главной задачей мы считаем показать детям многообразие естественно-научных и гуманитарных направлений — постепенно добавляются история, география, биология, физика и химия.',
          ]),
          layout: [
            {
              blockType: 'audience',
              title: 'Для кого подходит средняя школа',
              text: 'Многообразие направлений и постепенный переход к углублённой подготовке по интересам.',
              hideHeader: false,
              items: [
                {
                  title: 'Для учеников 5–8 классов',
                  text: 'Добавляются занятия по истории, географии, биологии, затем физике и химии — многообразие направлений.',
                  icon: 'graduation-cap',
                },
                {
                  title: 'Для тех, кто определяется с интересами',
                  text: 'Творческие занятия постепенно переходят в индивидуальные увлечения в послешкольное время.',
                  icon: 'compass',
                },
                {
                  title: 'Для углублённой подготовки',
                  text: 'Больше времени на качественную подготовку по русскому языку, математике и английскому.',
                  icon: 'book-open',
                },
              ],
            },
            {
              blockType: 'program',
              title: 'Что входит в программу средней школы',
              description: 'Базовые предметы и постепенное погружение в профильные направления.',
              items: [
                {
                  title: 'Базовые предметы',
                  text: 'Углублённая подготовка по русскому языку, математике и английскому языку.',
                  icon: 'book-open',
                },
                {
                  title: 'Профильные предметы',
                  text: 'Погружение в профильные предметы в зависимости от личных интересов ребёнка.',
                  icon: 'flask-conical',
                },
                {
                  title: 'Аттестация',
                  text: 'Все аттестационные мероприятия — через Академическую гимназию, которая ведёт личные дела детей и переводит в следующий класс.',
                  icon: 'award',
                },
                {
                  title: 'Школьные мероприятия',
                  text: 'Дни самоуправления, тематические недели, фестивали, праздники, экскурсии и ярмарки.',
                  icon: 'party-popper',
                },
              ],
            },
          ],
        },
        {
          title: 'Расписание',
          icon: 'calendar-days',
          layout: [
            {
              blockType: 'schedule',
              title: 'Расписание дня',
              hideTitle: true,
              description:
                'Пн–Пт, с 8:30 до 15:30, далее ребята могут оставаться в холле школы, соблюдая правила и не мешая дополнительным занятиям, проходящим в учебных классах после 15:30.',
              scheduleItems: [
                {
                  label: '9:00–14:10',
                  value:
                    'Занятия по школьному расписанию с переменами и перерывами на завтрак (9:40), перекус (10:35), обед (12:15). В 8 классе могут быть занятия 1–2 раза в неделю до 15:00',
                },
                {
                  label: '14:10–15:30',
                  value: 'Перекус, затем шахматы, консультации и самоподготовка (организация выполнения домашнего задания)',
                },
              ],
            },
          ],
        },
        {
          title: 'Стоимость',
          icon: 'wallet',
          content: makeRichTextMixed([
            {
              type: 'paragraph',
              text: 'Стоимость одного месяца обучения и сопровождения ребёнка составляет 53 000 рублей (включая питание и все занятия по расписанию до 15:30).',
            },
            {
              type: 'paragraph',
              text: 'Также в «Новой школе» есть ежегодный организационный взнос в размере 53 000 рублей, который идёт на приобретение всех учебных пособий и материалов для занятий, проведение праздников, организацию экскурсий (8–9 в год).',
            },
            {
              type: 'paragraph',
              text: 'Возможна оплата образовательной части договора материнским капиталом, а также получение вычета по НДФЛ.',
            },
          ]),
        },
        {
          title: 'Условия приёма',
          icon: 'heart-handshake',
          layout: [
            {
              blockType: 'program',
              title: 'Как поступить',
              description: 'Два простых шага, чтобы ребёнок стал учеником «Новой школы».',
              items: [
                {
                  title: 'Встреча с директором',
                  text: 'Встреча родителей с директором и экскурсия по школе. Записаться можно через заявку на сайте, по телефону +7 925 292-40-96 или сообщением на этот номер в любом мессенджере.',
                },
                {
                  title: 'Пробные дни',
                  text: 'Бесплатные пробные дни (2–3 дня) — чтобы ребёнок познакомился со школой, а школа с ребёнком. На пробных днях мы проводим тестирование детей в учебной обстановке, а по его результатам заключаем договор.',
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
      slug: 'starshie-klassy',
      generateSlug: false,
      title: 'Старшие классы',
      category: programCategories['shkola'].id,
      shortDescription:
        'Классы с 9 по 11: профильная подготовка к экзаменам, естественно-научное или гуманитарное направление.',
      previewImage: media.clubStarshieKlassy.id,
      coverImage: media.clubStarshieKlassy.id,
      coverImagePosition: 'center',
      tabs: [
        {
          title: 'Описание',
          icon: 'book-open',
          content: makeRichText([
            'В старшей школе с 9-го по 11-й классы становится значимой профильность подготовки для наилучших результатов государственных экзаменов, при этом мы продолжаем развивать общеобразовательный кругозор по всем предметам.',
          ]),
          layout: [
            {
              blockType: 'audience',
              title: 'Два варианта профильной подготовки',
              text: 'В «Новой школе» есть два варианта развития профильных направлений — в зависимости от того, сколько классов учится в параллели.',
              hideHeader: false,
              items: [
                {
                  title: 'Один класс в параллели',
                  text: 'Ребята добирают знания и навыки по профилям на консультациях по подготовке к выбранным экзаменам, встроенных в учебное расписание.',
                  icon: 'target',
                },
                {
                  title: 'Два класса в параллели',
                  text: 'Дети и родители сразу выбирают направление — естественно-научное или гуманитарное, и мы учитываем углублённое изучение соответствующих предметов.',
                  icon: 'compass',
                },
              ],
            },
            {
              blockType: 'program',
              title: 'Что входит в подготовку старшеклассников',
              description: 'Системная подготовка к экзаменам и взрослая, но насыщенная школьная жизнь.',
              items: [
                {
                  title: 'Государственные экзамены',
                  text: 'Помощь в подготовке встроена в расписание: самостоятельное выполнение заданий, проверка, разбор ошибок, объяснение сложных тем.',
                  icon: 'award',
                },
                {
                  title: 'Аттестация',
                  text: 'Все аттестационные мероприятия — через Академическую гимназию. Государственные экзамены наши дети сдают в Москве.',
                  icon: 'check-circle',
                },
                {
                  title: 'Школьные мероприятия',
                  text: 'Дискотеки, дни самоуправления, фестивали, праздники, экскурсии, ярмарки.',
                  icon: 'party-popper',
                },
                {
                  title: 'Самостоятельность',
                  text: 'Умение решать возникающие вопросы самим — то, на чём мы акцентируем внимание в воспитательной части образовательного процесса.',
                  icon: 'star',
                },
              ],
            },
          ],
        },
        {
          title: 'Расписание',
          icon: 'calendar-days',
          layout: [
            {
              blockType: 'schedule',
              title: 'Расписание дня',
              hideTitle: true,
              description:
                'Пн–Пт, с 8:30 до 15:30, далее ребята могут оставаться в классах школы, консультироваться у преподавателей, общаться, соблюдая правила и не мешая дополнительным занятиям, проходящим в учебных классах после 15:30.',
              scheduleItems: [
                {
                  label: '9:00–15:00',
                  value:
                    'Занятия по школьному расписанию с переменами и перерывами на завтрак (9:40), перекус (10:35), обед (12:15)',
                },
                {
                  label: '14:10–15:30',
                  value: 'Перекус, консультации и самоподготовка (организация выполнения домашнего задания)',
                },
              ],
            },
          ],
        },
        {
          title: 'Стоимость',
          icon: 'wallet',
          content: makeRichTextMixed([
            {
              type: 'paragraph',
              text: 'Стоимость одного месяца обучения и сопровождения ребёнка составляет 53 000 рублей (включая питание и все занятия по расписанию до 15:30).',
            },
            {
              type: 'paragraph',
              text: 'Также в «Новой школе» есть ежегодный организационный взнос в размере 53 000 рублей, который идёт на приобретение всех учебных пособий и материалов для занятий, проведение праздников, организацию экскурсий (8–9 в год).',
            },
            {
              type: 'paragraph',
              text: 'Возможна оплата образовательной части договора материнским капиталом, а также получение вычета по НДФЛ.',
            },
          ]),
        },
        {
          title: 'Условия приёма',
          icon: 'heart-handshake',
          layout: [
            {
              blockType: 'program',
              title: 'Как поступить',
              description: 'Три шага, чтобы ребёнок стал учеником «Новой школы».',
              items: [
                {
                  title: 'Встреча с директором',
                  text: 'Встреча родителей с директором и экскурсия по школе. Записаться можно через заявку на сайте, по телефону +7 925 292-40-96 или сообщением на этот номер в любом мессенджере.',
                },
                {
                  title: 'Онлайн-тестирование',
                  text: 'Для поступающих в 9-й и 11-й класс — тестирование по русскому языку и математике в Академической гимназии. Всю информацию и демонстрационные варианты вышлет администратор «Новой школы».',
                },
                {
                  title: 'Пробные дни',
                  text: 'Бесплатные пробные дни (2–3 дня) — чтобы ребёнок познакомился со школой, а школа с ребёнком. На пробных днях мы проводим тестирование детей в учебной обстановке, а по его результатам заключаем договор.',
                },
              ],
            },
          ],
        },
      ],
      isActive: true,
      sortOrder: 3,
    },
  ] as const

  const clubDocsBySlug = new Map<string, { id: number }>()

  for (const club of collectionSeeds) {
    const clubDoc = await upsertPublishedDoc(payload, 'clubs', 'slug', club.slug, club as Record<string, unknown>)
    clubDocsBySlug.set(club.slug, clubDoc as { id: number })
  }

  // Строки расписания кружка «Расписание» ссылаются на другие кружки по id,
  // поэтому их можно собрать только после того, как все кружки созданы выше.
  const scheduleDayClubs: Array<{ slug: string; days: string[]; time: string }> = [
    { days: ['monday', 'wednesday'], slug: 'rukodelie', time: '16:00–16:45' },
    { days: ['tuesday', 'thursday'], slug: 'kulinariya', time: '15:00–16:00' },
    { days: ['friday', 'saturday'], slug: 'hudozhestvennaya-studiya', time: '11:00–12:00' },
    { days: ['monday', 'thursday'], slug: 'muzykalno-teatralnaya-studiya', time: '17:00–18:00' },
    { days: ['tuesday', 'sunday'], slug: 'krasivoe-pismo', time: '16:30–17:15' },
    { days: ['wednesday', 'sunday'], slug: 'mentalnaya-arifmetika', time: '15:30–16:30' },
  ]

  const scheduleWeekdays = [
    { title: 'Понедельник', value: 'monday' },
    { title: 'Вторник', value: 'tuesday' },
    { title: 'Среда', value: 'wednesday' },
    { title: 'Четверг', value: 'thursday' },
    { title: 'Пятница', value: 'friday' },
    { title: 'Суббота', value: 'saturday' },
    { title: 'Воскресенье', value: 'sunday' },
  ]

  const scheduleTabs = scheduleWeekdays.map(({ title: dayTitle, value: day }) => {
    const dayClubs = scheduleDayClubs
      .filter((club) => club.days.includes(day))
      .map((club) => ({ id: clubDocsBySlug.get(club.slug)?.id, time: club.time }))
      .filter((club): club is { id: number; time: string } => typeof club.id === 'number')

    if (dayClubs.length === 0) {
      return {
        title: dayTitle,
        content: makeRichText(['В этот день кружки по расписанию не проходят.']),
      }
    }

    return {
      title: dayTitle,
      layout: [
        {
          blockType: 'schedule',
          title: `Кружки — ${dayTitle}`,
          hideHeader: true,
          scheduleItems: dayClubs.map((club) => ({ club: club.id, value: club.time })),
        },
      ],
    }
  })

  await upsertPublishedDoc(payload, 'clubs', 'slug', 'raspisanie-kruzhkov', {
    tabs: scheduleTabs,
  })

  const newsSeeds = [
    {
      slug: 'den-otkrytyh-dverey-29-avgusta',
      generateSlug: false,
      title: '29 августа в 12:00 День открытых дверей в «Новой школе»',
      publishedAt: '2026-08-21T14:38:39.645Z',
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
    startYear: number
    description: ReturnType<typeof makeRichText>
    photo: number
    sortOrder: number
  }[] = [
    {
      name: 'Юлия',
      position: 'Преподаватель английского языка',
      startYear: 2015,
      description: makeRichText([
        'Ведёт занятия по английскому языку для школьников и взрослых, а также Speaking Club для взрослых. Общий стаж преподавания — более 14 лет.',
      ]),
      photo: media.teacherJulia.id,
      sortOrder: 0,
    },
    {
      name: 'Ольга',
      position: 'Подготовка к ЕГЭ по английскому языку',
      startYear: 2016,
      description: makeRichText([
        'Готовит учеников к ЕГЭ по английскому языку. Общий стаж преподавания — более 22 лет. Ученики стабильно показывают высокие результаты: в 2017 году после года занятий сдали экзамен на 86–89 баллов.',
      ]),
      photo: media.teacherOlga.id,
      sortOrder: 1,
    },
    {
      name: 'Андрей',
      position: 'Преподаватель английского языка',
      startYear: 2015,
      description: makeRichText([
        'Ведёт занятия по английскому языку для школьников и взрослых, Speaking Club, а также готовит к собеседованиям и международным экзаменам. Общий стаж преподавания — более 14 лет.',
      ]),
      photo: media.teacherAndrey.id,
      sortOrder: 2,
    },
    {
      name: 'Мария',
      position: 'Английский язык для дошкольников',
      startYear: 2016,
      description: makeRichText([
        'Ведёт занятия по английскому языку для дошкольников. Общий стаж преподавания — более 19 лет.',
      ]),
      photo: media.teacherMaria.id,
      sortOrder: 3,
    },
    {
      name: 'Евгения',
      position: 'Преподаватель английского языка',
      startYear: 2015,
      description: makeRichText([
        'Ведёт занятия по английскому языку для школьников и взрослых, а также Speaking Club. Общий стаж преподавания — более 24 лет.',
      ]),
      photo: media.teacherEvgenia.id,
      sortOrder: 4,
    },
  ]

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

  const gallerySeeds = [
    {
      title: 'Галерея на главной',
      description: '',
      images: galleryMediaFiles.map(({ key }) => media[key].id),
      sortOrder: 2,
    },
    {
      title: 'Альбом 1',
      description: PLACEHOLDER_TEXT,
      images: [],
      sortOrder: 1,
    },
    {
      title: 'Альбом 2',
      description: PLACEHOLDER_TEXT,
      images: [],
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
  programCategories: Record<string, { id: number }>,
) {
  const pages = [
    {
      slug: 'home',
      title: 'О новой школе',
      pageTitle: 'О новой школе',
      layout: [
        makeHeroMarqueeBlock({
          tagline: 'Миссия Новой школы',
          title: 'Качественное образование в дружелюбной обстановке',
          titleEmphasis: 'дружелюбной обстановке',
          description:
            'Классы до 15 человек, все предметы по ФГОС, углублённое изучение английского по британским программам и подготовка к экзаменам с профессиональными педагогами.',
          primaryButtonLabel: 'Школа',
          primaryButtonLink: '/school',
          secondaryButtonLabel: 'Дополнительные программы',
          secondaryButtonLink: '/programs',
          images: [
            media.gallery1.id,
            media.gallery2.id,
            media.gallery3.id,
            media.gallery4.id,
            media.gallery5.id,
            media.gallery6.id,
            media.gallery7.id,
            media.gallery8.id,
            media.gallery9.id,
            media.gallery10.id,
            media.gallery11.id,
          ],
        }),
      ],
      meta: {
        title: 'О новой школе',
        description: PLACEHOLDER_TEXT,
      },
    },
    {
      slug: 'school',
      title: 'Школа',
      pageTitle: 'Школа',
      layout: [
        makeHeroBlock({
          title: 'Миссия «Новой школы»\nв г. Королеве',
          description:
            'Это качественное образование в дружелюбной обстановке. Мы соединили лучшее из современных образовательных технологий, чтобы в школу хотелось возвращаться.',
          primaryButtonLabel: 'Записаться на урок',
          primaryButtonLink: '/contacts',
          image: media.hero.id,
        }),
        makeMarqueeBlock([
          'Классы до 15 человек',
          'Все предметы по ФГОС',
          'Английский по британским программам',
          'Подготовка к экзаменам',
          'Шахматы',
          'Ежегодная аттестация',
          'Ежемесячные экскурсии',
          '«Школа полного дня» до 19:00',
        ]),
        makeCollectionGridBlock('Общеобразовательные программы', 'clubs', 4, false, '', {
          categoryFilter: programCategories['shkola'].id,
          cardDesign: 'category',
          hideTitle: false,
        }),
        makeWhyUsFeatureCardsBlock(),
        {
          blockType: 'teacherSpotlight',
          title: 'Педагоги Новой школы',
          text: 'Педагоги Новой школы совмещают высокий уровень преподавания с индивидуальным подходом к возможностям каждого ребёнка:',
          items: [
            {
              text: 'Посильные домашние задания, направленные на закрепление изученного и обратную связь ученика с учителем',
            },
            {
              text: 'Оценивание процента правильного выполнения контрольных и самостоятельных работ с последующей проработкой пробелов',
            },
            {
              text: 'Подготовка к экзаменам, участие в олимпиадах, проектная деятельность',
            },
          ],
          closingText:
            'Дети, обучающиеся в Новой школе, проходят аттестации в аккредитованной образовательной организации, а мы проводим для них занятия по подготовке к аттестациям и экзаменам в соответствии с ФГОС, совмещая государственные стандарты с альтернативными современными методиками.',
          buttonLabel: 'Наши преподаватели',
          buttonLink: '/teachers',
          imagePosition: 'right',
        },
        makeCollectionGridBlock('Галерея', 'galleryAlbums', 6, false, '', { hideTitle: true }),
        makeSchoolLifeBlock(),
        makeCollectionGridBlock('О нас говорят', 'reviews', 3, false, ''),
        makeCollectionGridBlock('Новости', 'news', 3, true, ''),
      ],
      meta: {
        title: 'Школа',
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
        makeTitleDescriptionBlock('Кружки вместо гаджетов', ''),
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
      slug: 'faq',
      title: 'Вопросы и ответы',
      pageTitle: 'Вопросы и ответы',
      layout: [
        {
          blockType: 'faq',
          title: 'Частые вопросы',
          description: 'Ответы на вопросы, которые чаще всего задают родители.',
          items: [
            {
              category: 'Поступление',
              question: 'С какого возраста можно записать ребёнка в «Новую школу»?',
              answer:
                'Мы принимаем детей дошкольного возраста в группу подготовки к школе, а также на программу семейных классов. Точные возрастные группы уточняйте у администратора при подаче заявки.',
            },
            {
              category: 'Поступление',
              question: 'Как записаться на занятия и есть ли пробный урок?',
              answer:
                'Оставьте заявку через форму на сайте — мы свяжемся с вами, расскажем о программе и подберём удобное время для пробного занятия.',
            },
            {
              category: 'Поступление',
              question: 'Можно ли посетить школу перед зачислением?',
              answer:
                'Да, мы регулярно проводим дни открытых дверей и всегда рады показать школу и познакомить с педагогами по предварительной договорённости.',
            },
            {
              category: 'Оплата',
              question: 'Сколько стоит обучение и как оформляется оплата?',
              answer:
                'Стоимость зависит от выбранной программы: семейные классы, продлёнка, программы дополнительного образования. Актуальный прайс-лист и условия оплаты можно посмотреть в разделе документов школы или уточнить у администратора.',
            },
            {
              category: 'Оплата',
              question: 'Можно ли оплатить обучение частями или получить рассрочку?',
              answer:
                'Да, по большинству программ доступна помесячная оплата. Условия рассрочки уточняйте у администратора при оформлении.',
            },
            {
              category: 'Обучение',
              question: 'Есть ли группа продлённого дня?',
              answer:
                'Да, после основных занятий дети могут остаться в группе продлённого дня — под присмотром педагогов, с прогулками, отдыхом и выполнением домашних заданий.',
            },
            {
              category: 'Обучение',
              question: 'Сколько детей в группе и кто ведёт занятия?',
              answer:
                'Группы небольшие, что позволяет педагогам уделять внимание каждому ребёнку. Занятия ведут опытные преподаватели с профильным образованием.',
            },
            {
              category: 'Программы',
              question: 'Какие программы и дополнительные занятия доступны?',
              answer:
                'Кулинария, рукоделие, художественная студия, музыкально-театральная студия, красивое письмо и школа английского языка — можно выбрать одну или несколько программ в дополнение к основным занятиям.',
            },
            {
              category: 'Программы',
              question: 'Можно ли совмещать несколько программ дополнительного образования?',
              answer:
                'Да, дети могут посещать несколько кружков одновременно — расписание составляется так, чтобы занятия не пересекались.',
            },
          ],
        },
      ],
      meta: {
        title: 'Вопросы и ответы',
        description: 'Ответы на частые вопросы родителей о поступлении, программах и оплате.',
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
      _status: 'published',
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
      ...makeUrlNavigationLink('О нас', '/'),
      subLinks: [
        pages.home ? makePageNavigationSubLink('Главная', pages.home.id) : makeUrlNavigationSubLink('Главная', '/'),
        makeUrlNavigationSubLink('Преподаватели', '/teachers'),
        makeUrlNavigationSubLink('Вакансии', '/vacancies'),
        makeUrlNavigationSubLink('Новости', '/news'),
        pages.faq
          ? makePageNavigationSubLink('Вопросы и ответы', pages.faq.id)
          : makeUrlNavigationSubLink('Вопросы и ответы', '/faq'),
        pages.contacts
          ? makePageNavigationSubLink('Контакты', pages.contacts.id)
          : makeUrlNavigationSubLink('Контакты', '/contacts'),
      ],
    },
    pages.school
      ? makePageNavigationLink('Школа', pages.school.id)
      : makeUrlNavigationLink('Школа', '/school'),
    pages.programs
      ? makePageNavigationLink('Дополнительные программы', pages.programs.id)
      : makeUrlNavigationLink('Дополнительные программы', '/programs'),
    makeUrlNavigationLink('Сведения об образовательной организации', '/organization-info'),
  ]

  const secondaryHeaderLinks: NavigationLink[] = [
    makeUrlNavigationLink(defaultSitePhone, defaultSitePhoneHref),
  ]

  await payload.updateGlobal({
    context: SEED_CONTEXT,
    data: {
      navigationLinks,
      secondaryHeaderLinks,
      showSecondaryHeader: true,
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

async function seedSiteSettings(
  payload: Awaited<ReturnType<typeof getPayload>>,
  media: Record<string, { id: number }>,
) {
  await payload.updateGlobal({
    context: SEED_CONTEXT,
    data: {
      siteName: 'Новая школа',
      logoType: 'image',
      logoImage: media.logoBig.id,
      logoImageCompact: media.logoCompact.id,
      phone: defaultSitePhone,
      address: 'г. Королёв, пр-кт Королёва, д. 5Д, пом. 501',
      workingHours: '8:00 — 20:00',
      vkUrl: 'https://vk.com/newschool_korolev',
      maxUrl: 'https://vk.me/79252924096',
      telegramUrl: 'https://t.me/New_School_Korolev',
      whatsappUrl: 'https://web.whatsapp.com/send?phone=79252924096',
      defaultApplicationCtaText: 'Связаться',
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
    const pages = await seedPages(payload, media, programCategories)
    await seedHeader(payload, pages)
    await seedFooter(payload)
    await seedSiteSettings(payload, media)

    console.log('Development seed completed successfully.')
  } finally {
    await payload.destroy()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
