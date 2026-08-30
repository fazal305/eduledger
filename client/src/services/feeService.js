import { api } from './api'

export async function fetchFees(params) {
  const { data } = await api.get('/fees', { params })
  return data
}

export async function fetchFee(id) {
  const { data } = await api.get(`/fees/${id}`)
  return data.data
}

export async function createFee(payload) {
  const { data } = await api.post('/fees', payload)
  return data.data
}

export async function fetchFeeSummary(academicYearId) {
  const { data } = await api.get('/fees/summary', { params: { academicYearId } })
  return data.data
}

export async function recordPayment(feeId, payload) {
  const { data } = await api.post(`/fees/${feeId}/payments`, payload)
  return data.data
}
