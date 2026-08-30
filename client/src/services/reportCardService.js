import { api } from './api'

export async function fetchReportCard(studentId, academicYearId) {
  const { data } = await api.get(`/students/${studentId}/report-card`, {
    params: { academicYearId },
  })
  return data.data
}
