import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  // Без auth - полностью кастомная passwordless авторизация
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
      label: 'Имя',
    },
    {
      name: 'verified',
      type: 'checkbox',
      label: 'Подтверждён',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'verificationCode',
      type: 'text',
      label: 'Код верификации',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'verificationCodeExpires',
      type: 'date',
      label: 'Срок действия кода',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Пользователь', value: 'user' },
        { label: 'Администратор', value: 'admin' },
      ],
      defaultValue: 'user',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
