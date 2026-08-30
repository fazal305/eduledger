import { api } from './api'

export async function fetchClasses(params) {
  const { data } = await api.get('/classes', { params })
  return data
}

export async function fetchClass(id) {
  const { data } = await api.get(`/classes/${id}`)
  return data.data
}

export async function createClass(payload) {
  const { data } = await api.post('/classes', payload)
  return data.data
}

export async function updateClass(id, payload) {
  const { data } = await api.put(`/classes/${id}`, payload)
  return data.data
}

export async function setClassActive(id, isActive) {
  const { data } = await api.patch(`/classes/${id}/active`, { isActive })
  return data.data
}
