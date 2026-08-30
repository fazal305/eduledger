import { api } from './api'

export async function fetchEnrollments(params) {
  const { data } = await api.get('/enrollments', { params })
  return data
}

export async function enrollStudent(payload) {
  const { data } = await api.post('/enrollments', payload)
  return data.data
}

export async function dropEnrollment(id) {
  const { data } = await api.patch(`/enrollments/${id}/drop`)
  return data.data
}
