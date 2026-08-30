import { api } from './api'

export async function fetchDepartments() {
  const { data } = await api.get('/reference/departments')
  return data.data
}

export async function fetchAcademicYears() {
  const { data } = await api.get('/reference/academic-years')
  return data.data
}

export async function fetchSections(academicYearId) {
  const { data } = await api.get('/reference/sections', { params: { academicYearId } })
  return data.data
}

export async function fetchFeeTypes() {
  const { data } = await api.get('/reference/fee-types')
  return data.data
}
