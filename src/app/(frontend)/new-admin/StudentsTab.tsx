'use client'

import Link from 'next/link'

interface Student {
  id: number
  name: string
  email: string
}

interface StudentsTabProps {
  students: Student[]
}

export function StudentsTab({ students }: StudentsTabProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text">Ученики</h2>
        <span className="text-sm text-text-light">{students.length} учеников</span>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-12 text-text-light">
          <p>Нет зарегистрированных учеников</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <Link
              key={student.id}
              href={`/new-admin/student/${student.id}`}
              className="bg-surface rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-primary/30 cursor-pointer transition-all no-underline"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                  {(student.name || student.email).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text truncate m-0">{student.name || 'Без имени'}</p>
                  <p className="text-sm text-text-light truncate m-0">{student.email}</p>
                </div>
                <span className="text-primary text-sm whitespace-nowrap">Профиль &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
