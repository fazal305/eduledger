import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { api } from '../services/api'
import { useAuthStore } from '../store/authStore'

export function useCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser)
  const setStatus = useAuthStore((s) => s.setStatus)

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { data } = await api.get('/auth/me')
      return data.user
    },
    retry: false,
  })

  useEffect(() => {
    if (query.isSuccess) setUser(query.data)
    if (query.isError) setUser(null)
    if (query.isPending) setStatus('loading')
  }, [query.isSuccess, query.isError, query.isPending, query.data, setUser, setStatus])

  return query
}
