import 'dotenv/config'

import path from 'path'

import { getPayload } from 'payload'

import config from '@payload-config'

const SEED_CONTEXT = { disableRevalidate: true } as const

function makeRichTextMixed(blocks: Array<{ type: 'paragraph'; text: string } | { type: 'list'; items: string[] }>) {
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

async function findOneByField(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: 'programCategories' | 'clubs' | 'media',
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
  collection: 'programCategories' | 'clubs',
  fieldName: string,
  fieldValue: string,
  data: Record<string, unknown>,
) {
  const existing = await findOneByField(payload, collection, fieldName, fieldValue)

  if (existing) {
    return payload.update({
      collection,
      context: SEED_CONTEXT,
      data,
      id: existing.id,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection,
    context: SEED_CONTEXT,
    data,
    overrideAccess: true,
  })
}

async function upsertUpload(
  payload: Awaited<ReturnType<typeof getPayload>>,
  { filename, alt, filePath }: { filename: string; alt: string; filePath: string },
) {
  const existing = await findOneByField(payload, 'media', 'filename', filename)

  if (existing) {
    return payload.update({
      collection: 'media',
      context: SEED_CONTEXT,
      data: { alt },
      id: existing.id,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection: 'media',
    context: SEED_CONTEXT,
    data: { alt },
    filePath,
    overrideAccess: true,
    overwriteExistingFiles: true,
  })
}

async function main() {
  const payload = await getPayload({ config })

  try {
    const media = await upsertUpload(payload, {
      filename: 'gruppa-prodlennogo-dnya.jpg',
      alt: 'Дети в группе продлённого дня в «Новой школе»',
      filePath: path.resolve(process.cwd(), 'public/seed-media/programs/gruppa-prodlennogo-dnya.jpg'),
    })

    const category = await upsertPublishedDoc(payload, 'programCategories', 'slug', 'gruppa-prodlennogo-dnya', {
      title: 'Группа продлённого дня',
      slug: 'gruppa-prodlennogo-dnya',
      generateSlug: false,
      description:
        'Присмотр и занятия для детей школьного возраста в будни после уроков: прогулки, горячее питание, помощь с домашним заданием, чтение и творчество — до самого вечера, без гаджетов.',
      previewImage: media.id,
    } as Record<string, unknown>)

    await upsertPublishedDoc(payload, 'clubs', 'slug', 'gruppa-prodlennogo-dnya', {
      title: 'Группа продлённого дня',
      slug: 'gruppa-prodlennogo-dnya',
      generateSlug: false,
      category: category.id,
      shortDescription:
        'По будням с 13:00 до 19:00: прогулки на свежем воздухе, полдник и полноценный ужин, помощь с домашним заданием, чтение и игры — интересный день в дружественной среде с выполненными уроками и без гаджетов.',
      previewImage: media.id,
      coverImage: media.id,
      coverImagePosition: 'center',
      infoCards: [
        { title: 'Возраст', description: 'Дети школьного возраста', icon: 'baby' },
        { title: 'Время работы', description: 'Пн–Пт, 13:00–19:00', icon: 'clock' },
        { title: 'Группа', description: 'Педагог-воспитатель на 8 детей', icon: 'users' },
        { title: 'Питание', description: 'Полдник и полноценный ужин', icon: 'utensils' },
      ],
      tabs: [
        {
          title: 'Общее описание',
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
        },
        {
          title: 'Для кого',
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
          title: 'Программа',
          layout: [
            {
              blockType: 'program',
              title: 'Чем занимаемся каждый день',
              description: 'Баланс учёбы, отдыха и активности в течение дня.',
              items: [
                {
                  title: 'Домашние задания',
                  text: 'Помогаем разобраться и выполнить домашние задания в первой половине дня.',
                },
                {
                  title: 'Питание',
                  text: 'Полдник и полноценный горячий ужин.',
                },
                {
                  title: 'Прогулка',
                  text: 'Активные игры на свежем воздухе.',
                },
                {
                  title: 'Чтение',
                  text: 'Время для самостоятельного чтения.',
                },
                {
                  title: 'Творчество и фитнес',
                  text: 'Занятия по расписанию: творческие активности и физическая активность.',
                },
                {
                  title: 'Свободное время',
                  text: 'Настольные игры, чтение и другие спокойные занятия перед тем, как за ребёнком придут родители.',
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
              title: 'Распорядок дня',
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
    } as Record<string, unknown>)

    console.log('Группа продлённого дня: категория и программа успешно созданы/обновлены.')
  } finally {
    await payload.destroy()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
