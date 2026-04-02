import type { CollectionConfig } from 'payload'

export const UserFiles: CollectionConfig = {
  slug: 'user-files',
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'user', 'createdAt'],
    group: 'Файлы',
  },
  access: {
    // Только админы могут создавать/редактировать/удалять файлы
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
    // Пользователи могут видеть только свои файлы
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        user: {
          equals: user.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'filename',
      type: 'text',
      label: 'Название файла',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
    },
    {
      name: 'blobPathname',
      type: 'text',
      label: 'Путь в Blob',
      required: true,
      admin: {
        readOnly: true,
        description: 'Автоматически заполняется при загрузке',
      },
    },
    {
      name: 'blobUrl',
      type: 'text',
      label: 'URL файла',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'mimeType',
      type: 'text',
      label: 'Тип файла',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'fileSize',
      type: 'number',
      label: 'Размер (байт)',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Пользователь',
      required: true,
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
