import type { Block } from 'payload'

import { weekdayOptions } from '@/collections/Clubs/scheduleDays'

import { collectionListingPaths } from './collectionListingPaths'

export const CollectionGridBlock: Block = {
  slug: 'collectionGrid',
  interfaceName: 'CollectionGridBlock',
  labels: {
    singular: 'Список материалов',
    plural: 'Список материалов',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок',
      required: true,
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => {
            if (!value && siblingData?.collectionType === 'reviews') {
              return 'О нас говорят'
            }

            return value
          },
        ],
      },
    },
    {
      name: 'hideTitle',
      type: 'checkbox',
      label: 'Скрыть заголовок',
      defaultValue: false,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
      admin: {
        description: 'Краткий текст перед списком.',
      },
    },
    {
      name: 'collectionType',
      type: 'select',
      label: 'Тип материалов',
      required: true,
      options: [
        { label: 'Программы', value: 'clubs' },
        { label: 'Новости', value: 'news' },
        { label: 'Преподаватели', value: 'teachers' },
        { label: 'Отзывы', value: 'reviews' },
        { label: 'Вакансии', value: 'jobs' },
        { label: 'Галерея', value: 'galleryAlbums' },
      ],
      admin: {
        description: 'Выберите, какие материалы показать.',
      },
    },
    {
      name: 'itemLimit',
      type: 'number',
      label: 'Количество элементов',
      defaultValue: 6,
      min: 1,
      admin: {
        condition: (_data, siblingData) =>
          siblingData?.collectionType !== 'galleryAlbums' &&
          siblingData?.collectionType !== 'teachers' &&
          !siblingData?.manualSelection,
        description: 'Максимум карточек в выдаче.',
      },
    },
    {
      name: 'manualSelection',
      type: 'checkbox',
      label: 'Выбрать программы вручную',
      defaultValue: false,
      admin: {
        condition: (_data, siblingData) => siblingData?.collectionType === 'clubs',
        description:
          'Вместо автоматического списка активных программ показать только выбранные ниже — например, кружки по конкретному дню недели.',
      },
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'clubs',
      hasMany: true,
      label: 'Программы',
      admin: {
        condition: (_data, siblingData) =>
          siblingData?.collectionType === 'clubs' && Boolean(siblingData?.manualSelection),
        description: 'Выберите программы, которые нужно показать в этом списке.',
      },
    },
    {
      name: 'categoryFilter',
      type: 'relationship',
      relationTo: 'programCategories',
      label: 'Категория (фильтр)',
      admin: {
        condition: (_data, siblingData) =>
          siblingData?.collectionType === 'clubs' && !siblingData?.manualSelection,
        description: 'Показать только программы этой категории. Если не выбрано — все активные программы.',
      },
    },
    {
      name: 'weekday',
      type: 'select',
      label: 'День недели (фильтр)',
      options: weekdayOptions,
      admin: {
        condition: (_data, siblingData) =>
          siblingData?.collectionType === 'clubs' && !siblingData?.manualSelection,
        description:
          'Показать только программы, у которых в поле «Дни занятий» отмечен этот день. Используется, например, для вкладок «Расписание» по дням недели.',
      },
    },
    {
      name: 'galleryAlbum',
      type: 'relationship',
      label: 'Альбом галереи',
      relationTo: 'gallery-albums',
      admin: {
        condition: (_data, siblingData) => siblingData?.collectionType === 'galleryAlbums',
        description: 'Выберите конкретный альбом или оставьте пустым, чтобы показать фото из всех альбомов.',
      },
    },
    {
      name: 'showViewAllButton',
      type: 'checkbox',
      label: 'Показать кнопку "Смотреть все"',
      defaultValue: false,
      admin: {
        condition: (_data, siblingData) =>
          Boolean(siblingData?.collectionType && siblingData.collectionType in collectionListingPaths),
        description: 'Добавить кнопку-ссылку на страницу со всеми материалами этого типа.',
      },
    },
    {
      name: 'viewAllButtonLabel',
      type: 'text',
      label: 'Текст кнопки',
      defaultValue: 'Смотреть все',
      admin: {
        condition: (_data, siblingData) =>
          Boolean(
            siblingData?.showViewAllButton &&
              siblingData?.collectionType &&
              siblingData.collectionType in collectionListingPaths,
          ),
      },
    },
  ],
}
