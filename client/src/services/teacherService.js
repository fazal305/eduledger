import { api } from './api'

export async function fetchTeachers(params) {
  const { data } = await api.get('/teachers', { params })
  return data
}

export async function fetchTeacher(id) {
  const { data } = await api.get(`/teachers/${id}`)
  return data.data
}

export async function createTeacher(payload) {
  const { data } = await api.post('/teachers', payload)
  return data.data
}

export async function updateTeacher(id, payload) {
  const { data } = await api.put(`/teachers/${id}`, payload)
  return data.data
}

export async function setTeacherActive(id, isActive) {
  const { data } = await api.patch(`/teachers/${id}/active`, { isActive })
  return data.data
}
