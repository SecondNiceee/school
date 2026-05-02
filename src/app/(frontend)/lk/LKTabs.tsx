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
    <div className="max-w-[1200px] mx-auto">
      <nav className="flex gap-2 mb-6">
        <button
          className={`py-3 px-6 text-sm font-medium rounded-lg border-none cursor-pointer transition-all duration-200 ${
            activeTab === 'materials'
              ? 'bg-primary text-white'
              : 'bg-transparent text-text-light hover:bg-primary/10 hover:text-primary'
          }`}
          onClick={() => setActiveTab('materials')}
        >
          Материалы
        </button>
        <button
          className={`py-3 px-6 text-sm font-medium rounded-lg border-none cursor-pointer transition-all duration-200 flex items-center gap-2 ${
            activeTab === 'tests'
              ? 'bg-primary text-white'
              : 'bg-transparent text-text-light hover:bg-primary/10 hover:text-primary'
          }`}
          onClick={() => setActiveTab('tests')}
        >
          Тесты
          {pendingTests.length > 0 && (
            <span className="bg-secondary text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {pendingTests.length}
            </span>
          )}
        </button>
      </nav>

      {activeTab === 'materials' && (
        <section className="bg-surface rounded-2xl p-6 shadow-[0_4px_20px_rgba(99,102,241,0.1)]">
          {materials.length === 0 ? (
            <div className="text-center py-12 px-6 text-text-light">
              <p className="m-0 text-base">У вас пока нет учебных материалов</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {materials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === 'tests' && (
        <section>
          {testsLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4 text-text-light">
              <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="m-0">Загрузка тестов...</p>
            </div>
          ) : tests.length === 0 ? (
            <div className="bg-surface rounded-2xl p-6 shadow-[0_4px_20px_rgba(99,102,241,0.1)] text-center py-12 text-text-light">
              <p className="m-0 text-base">У вас пока нет назначенных тестов</p>
            </div>
          ) : (
            <>
              {pendingTests.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-text mb-4">Ожидают прохождения</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingTests.map((test) => (
                      <TestCard key={test.id} test={test} onStart={handleStartTest} />
                    ))}
                  </div>
                </div>
              )}

              {completedTests.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-text mb-4">Пройденные тесты</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
