import type { CollectionConfig } from 'payload'

export const Tests: CollectionConfig = {
  slug: 'tests',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название теста',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание',
    },
    {
      name: 'questions',
      type: 'array',
      label: 'Вопросы',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'questionText',
          type: 'text',
          label: 'Текст вопроса',
          required: true,
        },
        {
          name: 'questionType',
          type: 'select',
          label: 'Тип вопроса',
          required: true,
          defaultValue: 'choice',
          options: [
            { label: 'С вариантами ответов', value: 'choice' },
            { label: 'Текстовый ответ', value: 'text' },
          ],
        },
        {
          name: 'options',
          type: 'array',
          label: 'Варианты ответов',
          admin: {
            condition: (data, siblingData) => siblingData?.questionType === 'choice',
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Текст варианта',
              required: true,
            },
            {
              name: 'isCorrect',
              type: 'checkbox',
              label: 'Правильный ответ',
              defaultValue: false,
            },
          ],
        },
        {
          name: 'correctAnswer',
          type: 'text',
          label: 'Правильный ответ',
          admin: {
            condition: (data, siblingData) => siblingData?.questionType === 'text',
          },
        },
      ],
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      label: 'Назначено ученикам',
      relationTo: 'users',
      hasMany: true,
    },
  ],
}
