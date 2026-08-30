import { asyncHandler } from '../utils/asyncHandler.js'
import { getFees, getFeeWithPayments, createFee, getSummary } from '../services/fee.service.js'
import { recordPayment } from '../services/payment.service.js'

export const listFeesHandler = asyncHandler(async (req, res) => {
  res.json(await getFees(req.validatedQuery))
})

export const getFeeHandler = asyncHandler(async (req, res) => {
  res.json({ data: await getFeeWithPayments(Number(req.params.id)) })
})

export const createFeeHandler = asyncHandler(async (req, res) => {
  const fee = await createFee(req.body)
  res.status(201).json({ data: fee })
})

export const getSummaryHandler = asyncHandler(async (req, res) => {
  const academicYearId = req.validatedQuery.academicYearId
  res.json({ data: await getSummary(academicYearId) })
})

export const createPaymentHandler = asyncHandler(async (req, res) => {
  const result = await recordPayment({ ...req.body, feeId: Number(req.params.id) }, req.user.id)
  res.status(201).json({ data: result })
})
