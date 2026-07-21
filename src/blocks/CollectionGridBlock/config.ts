import type { Block } from 'payload'

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
      required: true,
      min: 1,
      admin: {
        description: 'Максимум карточек в выдаче.',
      },
    },
  ],
}
