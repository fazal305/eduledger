import { insertPayment, listPaymentsForFee } from '../repositories/payment.repository.js'
import { getFeeTotals, updateFeeStoredStatus, findFeeById } from '../repositories/fee.repository.js'
import { NotFoundError, BadRequestError } from '../utils/errors.js'

function deriveStoredStatus(amount, paidTotal) {
  if (paidTotal >= amount) return 'paid'
  if (paidTotal > 0) return 'partially_paid'
  return 'pending'
}

export async function recordPayment(data, recordedBy) {
  const totals = await getFeeTotals(data.feeId)
  if (!totals) throw new NotFoundError('Fee not found')

  const amount = Number(totals.amount)
  const alreadyPaid = Number(totals.paid_amount)
  const remaining = Math.round((amount - alreadyPaid) * 100) / 100

  if (data.amount > remaining) {
    throw new BadRequestError(
      `Payment of ${data.amount} exceeds the remaining balance of ${remaining} for this fee`,
    )
  }

  await insertPayment(data, recordedBy)

  const newPaidTotal = Math.round((alreadyPaid + data.amount) * 100) / 100
  await updateFeeStoredStatus(data.feeId, deriveStoredStatus(amount, newPaidTotal))

  return {
    fee: await findFeeById(data.feeId),
    payments: await listPaymentsForFee(data.feeId),
  }
}
