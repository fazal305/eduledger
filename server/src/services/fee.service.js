import { listFees, findFeeById, insertFee, getFeeSummary } from '../repositories/fee.repository.js'
import { listPaymentsForFee } from '../repositories/payment.repository.js'
import { parsePagination, buildMeta } from '../utils/pagination.js'
import { NotFoundError } from '../utils/errors.js'

export async function getFees(query) {
  const { page, pageSize, offset } = parsePagination(query)
  const { rows, total } = await listFees({
    studentId: query.studentId,
    status: query.status,
    academicYearId: query.academicYearId,
    limit: pageSize,
    offset,
  })
  return { data: rows, meta: buildMeta(page, pageSize, total) }
}

export async function getFeeWithPayments(id) {
  const fee = await findFeeById(id)
  if (!fee) throw new NotFoundError('Fee not found')
  const payments = await listPaymentsForFee(id)
  return { ...fee, payments }
}

export async function createFee(data) {
  const id = await insertFee(data)
  return findFeeById(id)
}

export async function getSummary(academicYearId) {
  return getFeeSummary(academicYearId)
}
