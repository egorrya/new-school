import type { Access } from 'payload'

export const publicReadBooleanField = (field: string): Access => {
  return ({ req: { user } }) => {
    if (user) return true

    return {
      [field]: {
        equals: true,
      },
    }
  }
}

export const publicReadPublishedAt: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    publishedAt: {
      less_than_equal: new Date().toISOString(),
    },
  }
}
