import type { CollectionConfig } from 'payload'

export const TestResults: CollectionConfig = {
  slug: 'test-results',
  admin: {
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'test',
      type: 'relationship',
      label: 'Тест',
      relationTo: 'tests',
      required: true,
    },
    {
      name: 'student',
      type: 'relationship',
      label: 'Ученик',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'answers',
      type: 'json',
      label: 'Ответы ученика',
      required: true,
    },
    {
      name: 'score',
      type: 'number',
      label: 'Количество правильных',
      required: true,
    },
    {
      name: 'totalQuestions',
      type: 'number',
      label: 'Всего вопросов',
      required: true,
    },
    {
      name: 'percentage',
      type: 'number',
      label: 'Процент правильных',
      required: true,
    },
    {
      name: 'completedAt',
      type: 'date',
      label: 'Дата прохождения',
      required: true,
    },
  ],
}
