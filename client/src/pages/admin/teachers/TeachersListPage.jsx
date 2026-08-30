import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import PageHeader from '../../../components/PageHeader'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import { TableLoading, TableEmpty, TableError } from '../../../components/ui/QueryState'
import Pagination from '../../../components/ui/Pagination'
import { useDebouncedValue } from '../../../hooks/useDebouncedValue'
import { fetchTeachers } from '../../../services/teacherService'
import { fetchDepartments } from '../../../services/referenceService'
import TeacherFormModal from './TeacherFormModal'

export default function TeachersListPage() {
  const [search, setSearch] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const debouncedSearch = useDebouncedValue(search)
  const queryClient = useQueryClient()

  const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: fetchDepartments })

  const params = {
    page,
    pageSize: 20,
    search: debouncedSearch || undefined,
    departmentId: departmentId || undefined,
  }

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['teachers', params],
    queryFn: () => fetchTeachers(params),
    placeholderData: (prev) => prev,
  })

  return (
    <div>
      <PageHeader title="Teachers" description="Manage teacher records and department assignments" />

      <div className="flex flex-wrap items-center gap-3 px-6 py-4">
        <input
          type="search"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-64 rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500"
          aria-label="Search teachers"
        />
        <select
          value={departmentId}
          onChange={(e) => {
            setDepartmentId(e.target.value)
            setPage(1)
          }}
          className="rounded-lg border border-ink-200 px-3 py-2 text-sm"
          aria-label="Filter by department"
        >
          <option value="">All departments</option>
          {departments?.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <div className="ml-auto">
          <Button onClick={() => setShowCreate(true)}>+ Add teacher</Button>
        </div>
      </div>

      <div className="mx-6 overflow-x-auto rounded-xl border border-ink-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50 text-xs font-medium uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Teacher</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          {isPending && <TableLoading columns={5} />}
          {isError && <TableError columns={5} message={error?.response?.data?.message} onRetry={refetch} />}
          {!isPending && !isError && data.data.length === 0 && (
            <TableEmpty columns={5} message="No teachers match your filters." />
          )}
          {!isPending && !isError && data.data.length > 0 && (
            <tbody>
              {data.data.map((teacher) => (
                <tr key={teacher.id} className="border-t border-ink-100 hover:bg-ink-50">
                  <td className="px-4 py-3">
                    <Link to={`/admin/teachers/${teacher.id}`} className="font-medium text-ink-900 hover:text-brand-600">
                      {teacher.first_name} {teacher.last_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-500">{teacher.email}</td>
                  <td className="px-4 py-3 text-ink-500">{teacher.department_name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Badge tone={teacher.is_active ? 'success' : 'neutral'}>
                      {teacher.is_active ? 'Active' : 'Archived'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/admin/teachers/${teacher.id}`} className="text-sm font-medium text-brand-600 hover:underline">
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
        <TeacherFormModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false)
            queryClient.invalidateQueries({ queryKey: ['teachers'] })
          }}
        />
      )}
    </div>
  )
}
