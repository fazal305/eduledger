import { api } from './api'

export async function fetchAttendance(classId, date) {
  const { data } = await api.get('/attendance', { params: { classId, date } })
  return data.data
}

export async function saveAttendance(payload) {
  const { data } = await api.post('/attendance', payload)
  return data.data
}
