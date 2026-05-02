'use client'

import { useState, useEffect, ComponentType } from 'react'
import { TestCard } from '@/components/TestCard'
import { TestTaker } from '@/components/TestTaker'

interface Material {
  id: number
  title: string
  description?: string | null
  fileName?: string | null
  fileUrl: string
  fileSize?: number | null
  createdAt: string
}

interface TestData {
  id: number
  title: string
  description?: string | null
  questionsCount: number
  completed: boolean
  result?: {
    score: number
    totalQuestions: number
    percentage: number
    completedAt: string
  } | null
}

interface MaterialCardProps {
  material: Material
}

interface LKTabsProps {
  materials: Material[]
  MaterialCard: ComponentType<MaterialCardProps>
}

export function LKTabs({ materials, MaterialCard }: LKTabsProps) {
  const [activeTab, setActiveTab] = useState<'materials' | 'tests'>('materials')
  const [tests, setTests] = useState<TestData[]>([])
  const [testsLoading, setTestsLoading] = useState(false)
  const [activeTestId, setActiveTestId] = useState<number | null>(null)

  const fetchTests = async () => {
    setTestsLoading(true)
    try {
      const response = await fetch('/api/tests')
      if (response.ok) {
        const data = await response.json()
        setTests(data.tests)
      }
    } catch (err) {
      console.error('Failed to fetch tests:', err)
    } finally {
      setTestsLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'tests' && tests.length === 0) {
      fetchTests()
    }
  }, [activeTab, tests.length])

  const handleStartTest = (testId: number) => {
    setActiveTestId(testId)
  }

  const handleCloseTest = () => {
    setActiveTestId(null)
  }

  const handleTestComplete = () => {
    fetchTests()
  }

  const pendingTests = tests.filter((t) => !t.completed)
  const completedTests = tests.filter((t) => t.completed)

  return (
    <div className="lk-content">
      <nav className="lk-tabs">
        <button
          className={`lk-tab ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          Материалы
        </button>
        <button
          className={`lk-tab ${activeTab === 'tests' ? 'active' : ''}`}
          onClick={() => setActiveTab('tests')}
        >
          Тесты
          {pendingTests.length > 0 && (
            <span className="tab-badge">{pendingTests.length}</span>
          )}
        </button>
      </nav>

      {activeTab === 'materials' && (
        <section className="lk-materials">
          {materials.length === 0 ? (
            <div className="lk-empty">
              <p>У вас пока нет учебных материалов</p>
            </div>
          ) : (
            <div className="materials-list">
              {materials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'tests' && (
        <section className="lk-tests">
          {testsLoading ? (
            <div className="lk-loading">
              <div className="spinner"></div>
              <p>Загрузка тестов...</p>
            </div>
          ) : tests.length === 0 ? (
            <div className="lk-empty">
              <p>У вас пока нет назначенных тестов</p>
            </div>
          ) : (
            <>
              {pendingTests.length > 0 && (
                <div className="tests-section">
                  <h3 className="tests-section-title">Ожидают прохождения</h3>
                  <div className="tests-grid">
                    {pendingTests.map((test) => (
                      <TestCard key={test.id} test={test} onStart={handleStartTest} />
                    ))}
                  </div>
                </div>
              )}

              {completedTests.length > 0 && (
                <div className="tests-section">
                  <h3 className="tests-section-title">Пройденные тесты</h3>
                  <div className="tests-grid">
                    {completedTests.map((test) => (
                      <TestCard key={test.id} test={test} onStart={handleStartTest} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {activeTestId && (
        <TestTaker
          testId={activeTestId}
          onClose={handleCloseTest}
          onComplete={handleTestComplete}
        />
      )}
    </div>
  )
}
