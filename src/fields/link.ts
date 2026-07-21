import type { Field, GroupField } from 'payload'

import deepMerge from '@/utilities/deepMerge'

export type LinkAppearances = 'default' | 'outline'

export const internalLinkCollections: Array<
  'pages' | 'news' | 'clubs'
> = ['pages', 'news', 'clubs']

export const appearanceOptions: Record<LinkAppearances, { label: string; value: string }> = {
  default: {
    label: 'По умолчанию',
    value: 'default',
  },
  outline: {
    label: 'Контурная',
    value: 'outline',
  },
}

type LinkType = (options?: {
  appearances?: LinkAppearances[] | false
  disableLabel?: boolean
  overrides?: Partial<GroupField>
}) => Field

export const link: LinkType = ({ appearances, disableLabel = false, overrides = {} } = {}) => {
  const linkResult: GroupField = {
    name: 'link',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              {
                label: 'Внутренняя ссылка',
                value: 'reference',
              },
              {
                label: 'Внешняя ссылка',
                value: 'custom',
              },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
            label: 'Открыть в новой вкладке',
          },
        ],
      },
    ],
  }

  const referenceField: Field = {
    name: 'reference',
    type: 'relationship',
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'reference',
      width: '50%',
    },
    label: 'Документ для ссылки',
    relationTo: internalLinkCollections,
    required: true,
  }

  const urlField: Field = {
    name: 'url',
    type: 'text',
    admin: {
      condition: (_, siblingData) => siblingData?.type === 'custom',
      width: '50%',
    },
    label: 'Ссылка',
    required: true,
  }

  if (!disableLabel) {
    linkResult.fields.push({
      type: 'row',
      fields: [
        referenceField,
        urlField,
        {
          name: 'label',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Текст ссылки',
          required: true,
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, referenceField, urlField]
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [appearanceOptions.default, appearanceOptions.outline]

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      admin: {
        description: 'Выберите, как должна отображаться ссылка.',
      },
      defaultValue: 'default',
      options: appearanceOptionsToUse,
    })
  }

  return deepMerge(linkResult, overrides)
}
