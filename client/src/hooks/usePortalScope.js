import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { fetchChildren } from '../services/portalService'

export function usePortalScope() {
  const user = useAuthStore((s) => s.user)
  const isParent = user?.role === 'parent'
  const [selectedId, setSelectedId] = useState(null)

  const { data: children, isPending: isLoadingChildren } = useQuery({
    queryKey: ['portal', 'children'],
    queryFn: fetchChildren,
    enabled: isParent,
  })

  const studentId = isParent ? (selectedId ?? children?.[0]?.id ?? null) : (user?.studentId ?? null)

  return {
    studentId,
    isParent,
    children,
    isLoadingChildren,
    selectedId: selectedId ?? children?.[0]?.id ?? null,
    setSelectedId,
  }
}
