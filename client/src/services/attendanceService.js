import { api } from './api'

export async function fetchAttendance(classId, date) {
  const { data } = await api.get('/attendance', { params: { classId, date } })
  return data.data
}

export async function saveAttendance(payload) {
  const { data } = await api.post('/attendance', payload)
  return data.data
}

export async function fetchStudentAttendanceSummary(studentId) {
  const { data } = await api.get(`/attendance/students/${studentId}/summary`)
  return data.data
}

export async function fetchStudentAttendanceHistory(studentId) {
  const { data } = await api.get(`/attendance/students/${studentId}/history`)
  return data.data
}
