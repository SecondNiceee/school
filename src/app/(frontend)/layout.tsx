import React from 'react'
import './styles.css'

export const metadata = {
  title: 'Онлайн-школа | Увлекательное обучение для детей',
  description: 'Современная онлайн-школа для детей. Интерактивные уроки, опытные преподаватели и удобный формат обучения.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
