import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { selfOnly } from '../../access/selfOnly'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Пользователь',
    plural: 'Пользователи',
  },
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    // The Payload account page uses these permissions, so users can read and
    // update their own name and email without gaining access to other accounts.
    read: selfOnly,
    update: selfOnly,
  },
  admin: {
    group: 'Система',
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Имя',
      admin: {
        description: 'Отображается в админке и списках пользователей.',
      },
    },
  ],
  timestamps: true,
}
