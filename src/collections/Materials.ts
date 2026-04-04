import type { CollectionConfig } from 'payload'

export const Materials: CollectionConfig = {
  slug: 'materials',
  labels: {
    singular: 'Материал',
    plural: 'Материалы',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'assignedTo', 'createdAt'],
    description: 'Учебные материалы для учеников',
  },
  access: {
    create: ({ req: { user } }) => user?.collection === 'admins',
    update: ({ req: { user } }) => user?.collection === 'admins',
    delete: ({ req: { user } }) => user?.collection === 'admins',
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.collection === 'admins') return true
      return {
        'assignedTo.id': {
          contains: user.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      label: 'Файл',
      required: true,
      admin: {
        description: 'Загрузите файл или выберите из Media библиотеки',
      },
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      label: 'Назначить ученикам',
      required: true,
      admin: {
        description: 'Выберите учеников, которым будет доступен этот материал',
      },
      filterOptions: {
        role: {
          equals: 'user',
        },
      },
    },
  ],
}
