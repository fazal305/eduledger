import { api } from './api'

export async function fetchCourses(params) {
  const { data } = await api.get('/courses', { params })
  return data
}

export async function fetchCourse(id) {
  const { data } = await api.get(`/courses/${id}`)
  return data.data
}

export async function createCourse(payload) {
  const { data } = await api.post('/courses', payload)
  return data.data
}

export async function updateCourse(id, payload) {
  const { data } = await api.put(`/courses/${id}`, payload)
  return data.data
}

export async function setCourseActive(id, isActive) {
  const { data } = await api.patch(`/courses/${id}/active`, { isActive })
  return data.data
}
