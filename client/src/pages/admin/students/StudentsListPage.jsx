import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import PageHeader from '../../../components/PageHeader'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import { TableLoading, TableEmpty, TableError } from '../../../components/ui/QueryState'
import Pagination from '../../../components/ui/Pagination'
import { useDebouncedValue } from '../../../hooks/useDebouncedValue'
import { fetchStudents } from '../../../services/studentService'
import { fetchSections } from '../../../services/referenceService'
import StudentFormModal from './StudentFormModal'

export default function StudentsListPage() {
  const [search, setSearch] = useState('')
  const [sectionId, setSectionId] = useState('')
  const [isActive, setIsActive] = useState('true')
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const debouncedSearch = useDebouncedValue(search)
  const queryClient = useQueryClient()

  const { data: sections } = useQuery({ queryKey: ['sections'], queryFn: () => fetchSections() })

  const params = {
    page,
    pageSize: 20,
    search: debouncedSearch || undefined,
    sectionId: sectionId || undefined,
    isActive: isActive || undefined,
  }

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['students', params],
    queryFn: () => fetchStudents(params),
    placeholderData: (prev) => prev,
  })

  function resetToFirstPage(setter) {
    return (value) => {
      setter(value)
      setPage(1)
    }
  }

  return (
    <div>
      <PageHeader title="Students" description="Register, search, and manage student records" />

      <div className="flex flex-wrap items-center gap-3 px-6 py-4">
        <input
          type="search"
          placeholder="Search name or student number…"
          value={search}
          onChange={(e) => resetToFirstPage(setSearch)(e.target.value)}
          className="w-64 rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500"
          aria-label="Search students"
        />
        <select
          value={sectionId}
          onChange={(e) => resetToFirstPage(setSectionId)(e.target.value)}
          className="rounded-lg border border-ink-200 px-3 py-2 text-sm"
          aria-label="Filter by section"
        >
          <option value="">All sections</option>
          {sections?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          value={isActive}
          onChange={(e) => resetToFirstPage(setIsActive)(e.target.value)}
          className="rounded-lg border border-ink-200 px-3 py-2 text-sm"
          aria-label="Filter by status"
        >
          <option value="true">Active</option>
          <option value="false">Archived</option>
          <option value="">All statuses</option>
        </select>
        <div className="ml-auto">
          <Button onClick={() => setShowCreate(true)}>+ Register student</Button>
        </div>
      </div>

      <div className="mx-6 overflow-x-auto rounded-xl border border-ink-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50 text-xs font-medium uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Student #</th>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3">Admitted</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          {isPending && <TableLoading columns={6} />}
          {isError && (
            <TableError columns={6} message={error?.response?.data?.message} onRetry={refetch} />
          )}
          {!isPending && !isError && data.data.length === 0 && (
            <TableEmpty columns={6} message="No students match your filters." />
          )}
          {!isPending && !isError && data.data.length > 0 && (
            <tbody>
              {data.data.map((student) => (
                <tr key={student.id} className="border-t border-ink-100 hover:bg-ink-50">
                  <td className="px-4 py-3">
                    <Link
                      to={`${student.id}`}
                      className="font-medium text-ink-900 hover:text-brand-600"
                    >
                      {student.first_name} {student.last_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-500">{student.student_number}</td>
                  <td className="px-4 py-3 text-ink-500">{student.section_name ?? '—'}</td>
                  <td className="px-4 py-3 text-ink-500">{student.admission_date}</td>
                  <td className="px-4 py-3">
                    <Badge tone={student.is_active ? 'success' : 'neutral'}>
                      {student.is_active ? 'Active' : 'Archived'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`${student.id}`} className="text-sm font-medium text-brand-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {!isPending && !isError && <Pagination meta={data.meta} onPageChange={setPage} />}
      </div>

      {showCreate && (
        <StudentFormModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false)
            queryClient.invalidateQueries({ queryKey: ['students'] })
          }}
        />
      )}
    </div>
  )
}
