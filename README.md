# Новая школа

Сайт школы «Новая школа» на Next.js App Router, TypeScript, Payload CMS, PostgreSQL и Tailwind CSS.

## Что уже есть

- Рабочая архитектура Payload CMS
- Авторизация и админка
- Загрузка медиафайлов
- Черновики и предпросмотр
- Рендер страниц через App Router
- Русскоязычный фронтенд

## Стек

- Next.js App Router
- TypeScript
- npm
- Payload CMS
- PostgreSQL
- Tailwind CSS

## Команды

- `npm run dev` - запуск в режиме разработки
- `npm run build` - production build
- `npm run start` - запуск production-сборки
- `npm run generate:types` - генерация `payload-types.ts`
- `npm run generate:importmap` - генерация `importMap.js`
- `npm run lint` - проверка кода

## Структура `src`

- `app` - маршруты Next.js, фронтенд и админка Payload
- `assets` - статические данные и fallback-контент
- `collections` - коллекции Payload
- `components` - `ui`, `layouts`, `screens`, `site`, `admin`
- `globals` - глобальные конфиги Payload
- `hooks` - общие hooks
- `lib` - общие helper-функции
- `types` - общие TypeScript-типизации

## Примечание

Для локального запуска нужен доступный PostgreSQL, указанный в `DATABASE_URL`.
