'use client'

import { useState } from 'react'
import { FilesTab } from './FilesTab'
import { MaterialsTab } from './MaterialsTab'
import { TestsTab } from './TestsTab'
import { StudentsTab } from './StudentsTab'

interface Student {
  id: number
  name: string
  email: string
}

interface AdminTabsProps {
  students: Student[]
}

export function AdminTabs({ students }: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<'files' | 'materials' | 'tests' | 'students'>('files')

  const tabClass = (tab: string) =>
    `px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
      activeTab === tab
        ? 'text-primary border-primary bg-primary/5'
        : 'text-text-light border-transparent hover:text-text hover:bg-gray-50'
    }`

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
      <nav className="flex gap-1 border-b border-gray-200 mb-6">
        <button className={tabClass('files')} onClick={() => setActiveTab('files')}>
          Файлы
        </button>
        <button className={tabClass('materials')} onClick={() => setActiveTab('materials')}>
          Материалы
        </button>
        <button className={tabClass('tests')} onClick={() => setActiveTab('tests')}>
          Тесты
        </button>
        <button className={tabClass('students')} onClick={() => setActiveTab('students')}>
          Ученики
        </button>
      </nav>

      <div>
        {activeTab === 'files' && <FilesTab />}
        {activeTab === 'materials' && <MaterialsTab students={students} />}
        {activeTab === 'tests' && <TestsTab students={students} />}
        {activeTab === 'students' && <StudentsTab students={students} />}
      </div>
      </div>
    </div>
  )
}
