import type { CollectionConfig } from 'payload'

export const Admins: CollectionConfig = {
  slug: 'admins',
  admin: {
    useAsTitle: 'email',
  },
  auth: true, // Required for Payload admin panel
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Имя',
    },
  ],
}
