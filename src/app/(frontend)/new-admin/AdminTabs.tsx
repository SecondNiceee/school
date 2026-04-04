'use client'

import { useState } from 'react'
import { FilesTab } from './FilesTab'
import { MaterialsTab } from './MaterialsTab'

interface Student {
  id: number
  name: string
  email: string
}

interface AdminTabsProps {
  students: Student[]
}

export function AdminTabs({ students }: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<'files' | 'materials'>('files')

  return (
    <div className="new-admin-content">
      <nav className="new-admin-tabs">
        <button
          className={`new-admin-tab ${activeTab === 'files' ? 'active' : ''}`}
          onClick={() => setActiveTab('files')}
        >
          Файлы
        </button>
        <button
          className={`new-admin-tab ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          Материалы
        </button>
      </nav>

      <div className="new-admin-tab-content">
        {activeTab === 'files' && <FilesTab />}
        {activeTab === 'materials' && <MaterialsTab students={students} />}
      </div>
    </div>
  )
}
