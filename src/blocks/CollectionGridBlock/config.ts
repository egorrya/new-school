import type { Block } from 'payload'

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
        { label: 'Кружки', value: 'clubs' },
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
        condition: (_data, siblingData) => siblingData?.collectionType !== 'galleryAlbums',
        description: 'Максимум карточек в выдаче.',
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
