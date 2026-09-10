import type { Access } from 'payload'

import type { User } from '@/payload-types'

/** Limits an auth-collection operation to the currently signed-in user. */
export const selfOnly: Access<User> = ({ req: { user } }) => {
  if (!user) {
    return false
  }

  return {
    id: {
      equals: user.id,
    },
  }
}
