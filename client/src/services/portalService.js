import { api } from './api'

export async function fetchChildren() {
  const { data } = await api.get('/portal/children')
  return data.data
}
