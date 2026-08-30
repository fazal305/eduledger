import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import PageHeader from '../../../components/PageHeader'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import { TableLoading, TableEmpty, TableError } from '../../../components/ui/QueryState'
import Pagination from '../../../components/ui/Pagination'
import { useDebouncedValue } from '../../../hooks/useDebouncedValue'
import { fetchClasses, setClassActive } from '../../../services/classService'
import { fetchAcademicYears } from '../../../services/referenceService'
import { useAuthStore } from '../../../store/authStore'
import ClassFormModal from './ClassFormModal'

const DAY_LABEL = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' }

export default function ClassesListPage() {
  const [search, setSearch] = useState('')
  const [academicYearId, setAcademicYearId] = useState('')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const debouncedSearch = useDebouncedValue(search)
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const canManage = user?.role === 'admin'
  const teacherScope = user?.role === 'teacher' ? user.teacherId : undefined

  const { data: academicYears } = useQuery({ queryKey: ['academicYears'], queryFn: fetchAcademicYears })

  const params = {
    page,
    pageSize: 20,
    search: debouncedSearch || undefined,
    academicYearId: academicYearId || undefined,
    teacherId: teacherScope,
  }

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['classes', params],
    queryFn: () => fetchClasses(params),
    placeholderData: (prev) => prev,
  })

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }) => setClassActive(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['classes'] }),
  })

  return (
    <div>
      <PageHeader title="Courses & Classes" description="A course taught to a section in a given academic year" />

      <div className="flex flex-wrap items-center gap-3 px-6 py-4">
        <input
          type="search"
          placeholder="Search course or section…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-64 rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500"
          aria-label="Search classes"
        />
        <select
          value={academicYearId}
          onChange={(e) => {
            setAcademicYearId(e.target.value)
            setPage(1)
          }}
          className="rounded-lg border border-ink-200 px-3 py-2 text-sm"
          aria-label="Filter by academic year"
        >
          <option value="">All academic years</option>
          {academicYears?.map((y) => (
            <option key={y.id} value={y.id}>
              {y.name}
            </option>
          ))}
        </select>
        {canManage && (
          <div className="ml-auto">
            <Button onClick={() => setShowCreate(true)}>+ Schedule class</Button>
          </div>
        )}
      </div>

      <div className="mx-6 overflow-x-auto rounded-xl border border-ink-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50 text-xs font-medium uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3">Teacher</th>
              <th className="px-4 py-3">Schedule</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          {isPending && <TableLoading columns={6} />}
          {isError && <TableError columns={6} message={error?.response?.data?.message} onRetry={refetch} />}
          {!isPending && !isError && data.data.length === 0 && (
            <TableEmpty columns={6} message="No classes match your filters." />
          )}
          {!isPending && !isError && data.data.length > 0 && (
            <tbody>
              {data.data.map((klass) => (
                <tr key={klass.id} className="border-t border-ink-100 hover:bg-ink-50">
                  <td className="px-4 py-3">
                    <Link to={`${klass.id}`} className="font-medium text-ink-900 hover:text-brand-600">
                      {klass.course_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-500">{klass.section_name}</td>
                  <td className="px-4 py-3 text-ink-500">{klass.teacher_name ?? 'Unassigned'}</td>
                  <td className="px-4 py-3 text-ink-500">
                    {klass.schedule_day ? DAY_LABEL[klass.schedule_day] : '—'}{' '}
                    {klass.start_time?.slice(0, 5) ?? ''}
                    {klass.end_time ? `–${klass.end_time.slice(0, 5)}` : ''}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={klass.is_active ? 'success' : 'neutral'}>
                      {klass.is_active ? 'Active' : 'Archived'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {canManage && (
                      <>
                        <button
                          onClick={() => setEditing(klass)}
                          className="mr-3 text-sm font-medium text-brand-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleActive.mutate({ id: klass.id, isActive: !klass.is_active })}
                          className="text-sm font-medium text-ink-500 hover:underline"
                        >
                          {klass.is_active ? 'Archive' : 'Reactivate'}
                        </button>
                      </>
                    )}
                    {!canManage && (
                      <Link to={`${klass.id}`} className="text-sm font-medium text-brand-600 hover:underline">
                        View
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {!isPending && !isError && <Pagination meta={data.meta} onPageChange={setPage} />}
      </div>

      {(showCreate || editing) && (
        <ClassFormModal
          klass={editing}
          onClose={() => {
            setShowCreate(false)
            setEditing(null)
          }}
          onSuccess={() => {
            setShowCreate(false)
            setEditing(null)
            queryClient.invalidateQueries({ queryKey: ['classes'] })
          }}
        />
      )}
    </div>
  )
}
