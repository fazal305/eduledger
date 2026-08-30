import { api } from './api'

export async function fetchExams(classId) {
  const { data } = await api.get('/exams', { params: { classId } })
  return data.data
}

export async function fetchExam(id) {
  const { data } = await api.get(`/exams/${id}`)
  return data.data
}

export async function createExam(payload) {
  const { data } = await api.post('/exams', payload)
  return data.data
}

export async function updateExam(id, payload) {
  const { data } = await api.put(`/exams/${id}`, payload)
  return data.data
}

export async function saveMarks(examId, records) {
  const { data } = await api.put(`/exams/${examId}/marks`, { records })
  return data.data
}
