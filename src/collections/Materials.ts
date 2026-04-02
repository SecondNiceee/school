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
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
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
      name: 'fileUrl',
      type: 'text',
      label: 'URL файла',
      required: true,
      admin: {
        components: {
          Field: '@/components/MaterialUpload#MaterialUploadField',
        },
      },
    },
    {
      name: 'fileName',
      type: 'text',
      label: 'Имя файла',
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'fileSize',
      type: 'number',
      label: 'Размер файла',
      admin: {
        readOnly: true,
        hidden: true,
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
