import React from 'react'
import type { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: 'Погружение в науку — Онлайн школа | Ирина Титова',
  description: 'Онлайн школа «Погружение в науку» — увлекательное обучение для детей с Ириной Титовой. Интерактивные уроки, опытные преподаватели и удобный формат онлайн обучения.',
  keywords: [
    'онлайн школа',
    'погружение в науку',
    'Ирина Титова',
    'онлайн обучение',
    'обучение для детей',
    'интерактивные уроки',
    'дистанционное образование',
    'онлайн уроки',
    'детское образование',
    'научная школа',
  ],
  authors: [{ name: 'Ирина Титова' }],
  creator: 'Ирина Титова',
  publisher: 'Погружение в науку',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Погружение в науку — Онлайн школа',
    title: 'Погружение в науку — Онлайн школа | Ирина Титова',
    description: 'Онлайн школа «Погружение в науку» — увлекательное обучение для детей с Ириной Титовой. Интерактивные уроки и удобный формат.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Погружение в науку — Онлайн школа | Ирина Титова',
    description: 'Онлайн школа «Погружение в науку» — увлекательное обучение для детей с Ириной Титовой.',
  },
  alternates: {
    canonical: '/',
  },
  verification: {
    // Добавьте сюда верификационные коды после регистрации в поисковиках
    // google: 'ваш-код-верификации-google',
    // yandex: 'ваш-код-верификации-yandex',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="ru">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
