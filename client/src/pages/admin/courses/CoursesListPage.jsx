import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import PageHeader from '../../../components/PageHeader'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import { TableLoading, TableEmpty, TableError } from '../../../components/ui/QueryState'
import Pagination from '../../../components/ui/Pagination'
import { useDebouncedValue } from '../../../hooks/useDebouncedValue'
import { fetchCourses, setCourseActive } from '../../../services/courseService'
import { fetchDepartments } from '../../../services/referenceService'
import CourseFormModal from './CourseFormModal'

export default function CoursesListPage() {
  const [search, setSearch] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(null)
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
    queryKey: ['courses', params],
    queryFn: () => fetchCourses(params),
    placeholderData: (prev) => prev,
  })

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }) => setCourseActive(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses'] }),
  })

  return (
    <div>
      <PageHeader title="Courses" description="Subjects offered across departments" />

      <div className="flex flex-wrap items-center gap-3 px-6 py-4">
        <input
          type="search"
          placeholder="Search name or code…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="w-64 rounded-lg border border-ink-200 px-3 py-2 text-sm focus:border-brand-500"
          aria-label="Search courses"
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
          <Button onClick={() => setShowCreate(true)}>+ Add course</Button>
        </div>
      </div>

      <div className="mx-6 overflow-x-auto rounded-xl border border-ink-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50 text-xs font-medium uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Credit hours</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          {isPending && <TableLoading columns={6} />}
          {isError && <TableError columns={6} message={error?.response?.data?.message} onRetry={refetch} />}
          {!isPending && !isError && data.data.length === 0 && (
            <TableEmpty columns={6} message="No courses match your filters." />
          )}
          {!isPending && !isError && data.data.length > 0 && (
            <tbody>
              {data.data.map((course) => (
                <tr key={course.id} className="border-t border-ink-100 hover:bg-ink-50">
                  <td className="px-4 py-3 font-medium text-ink-900">{course.name}</td>
                  <td className="px-4 py-3 text-ink-500">{course.code}</td>
                  <td className="px-4 py-3 text-ink-500">{course.department_name ?? '—'}</td>
                  <td className="px-4 py-3 text-ink-500">{course.credit_hours}</td>
                  <td className="px-4 py-3">
                    <Badge tone={course.is_active ? 'success' : 'neutral'}>
                      {course.is_active ? 'Active' : 'Archived'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditing(course)}
                      className="mr-3 text-sm font-medium text-brand-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleActive.mutate({ id: course.id, isActive: !course.is_active })}
                      className="text-sm font-medium text-ink-500 hover:underline"
                    >
                      {course.is_active ? 'Archive' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {!isPending && !isError && <Pagination meta={data.meta} onPageChange={setPage} />}
      </div>

      {(showCreate || editing) && (
        <CourseFormModal
          course={editing}
          onClose={() => {
            setShowCreate(false)
            setEditing(null)
          }}
          onSuccess={() => {
            setShowCreate(false)
            setEditing(null)
            queryClient.invalidateQueries({ queryKey: ['courses'] })
          }}
        />
      )}
    </div>
  )
}
