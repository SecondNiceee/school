import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    // verify: true включает поле _verified в коллекции
    // Автоматическую отправку письма отключаем через disableVerificationEmail в payload.create()
    // Наша верификация по коду реализована в /api/auth/register и /api/auth/verify-code
    verify: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Имя',
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
