import type { Block } from 'payload'

export const BannerSliderBlock: Block = {
  slug: 'bannerSlider',
  interfaceName: 'BannerSliderBlock',
  labels: {
    singular: 'Баннеры',
    plural: 'Баннеры',
  },
  fields: [
    {
      name: 'slides',
      type: 'array',
      label: 'Слайды',
      minRows: 1,
      labels: {
        singular: 'Слайд',
        plural: 'Слайды',
      },
      admin: {
        description: 'Добавьте баннеры для слайдера.',
        initCollapsed: true,
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
            description: 'Текст под заголовком слайда.',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Изображение',
          required: true,
          admin: {
            description: 'Изображение баннера.',
          },
        },
        {
          name: 'buttonLabel',
          type: 'text',
          label: 'Текст кнопки',
        },
        {
          name: 'buttonLink',
          type: 'text',
          label: 'Ссылка кнопки',
          admin: {
            description: 'Адрес для кнопки баннера.',
          },
        },
      ],
    },
  ],
}
