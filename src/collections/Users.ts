import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    verify: {
      generateEmailHTML: ({ token, user }) => {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`
        return `
          <h1>Подтвердите ваш email</h1>
          <p>Здравствуйте${user.name ? `, ${user.name}` : ''}!</p>
          <p>Пожалуйста, подтвердите ваш email, перейдя по ссылке:</p>
          <a href="${url}">${url}</a>
        `
      },
      generateEmailSubject: () => 'Подтверждение email',
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Имя',
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
