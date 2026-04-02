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
    // Только админы могут создавать/редактировать/удалять
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
    // Пользователи могут читать только свои материалы
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        assignedTo: {
          equals: user.id,
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
  upload: {
    staticDir: 'materials',
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/*',
      'video/*',
      'audio/*',
    ],
  },
}
