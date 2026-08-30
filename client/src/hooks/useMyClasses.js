import { useQuery } from '@tanstack/react-query'
import { fetchClasses } from '../services/classService'
import { useAuthStore } from '../store/authStore'

export function useMyClasses() {
  const user = useAuthStore((s) => s.user)
  const teacherScope = user?.role === 'teacher' ? user.teacherId : undefined

  return useQuery({
    queryKey: ['classes', 'mine', teacherScope],
    queryFn: () => fetchClasses({ isActive: 'true', pageSize: 100, teacherId: teacherScope }),
  })
}
