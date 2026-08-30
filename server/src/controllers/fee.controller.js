import { asyncHandler } from '../utils/asyncHandler.js'
import { getFees, getFeeWithPayments, createFee, getSummary } from '../services/fee.service.js'
import { recordPayment } from '../services/payment.service.js'
import { assertCanViewStudent } from '../services/studentAccess.service.js'
import { BadRequestError } from '../utils/errors.js'

export const listFeesHandler = asyncHandler(async (req, res) => {
  const query = { ...req.validatedQuery }

  if (req.user.role === 'student') {
    query.studentId = req.user.studentId
  } else if (req.user.role === 'parent') {
    if (!query.studentId) throw new BadRequestError('studentId is required')
    await assertCanViewStudent(req.user, query.studentId)
  }

  res.json(await getFees(query))
})

export const getFeeHandler = asyncHandler(async (req, res) => {
  const fee = await getFeeWithPayments(Number(req.params.id))
  if (req.user.role === 'student' || req.user.role === 'parent') {
    await assertCanViewStudent(req.user, fee.student_id)
  }
  res.json({ data: fee })
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
