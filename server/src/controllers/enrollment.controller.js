import { asyncHandler } from '../utils/asyncHandler.js'
import { getEnrollments, enrollStudent, dropEnrollment } from '../services/enrollment.service.js'
import { assertCanViewStudent } from '../services/studentAccess.service.js'
import { BadRequestError } from '../utils/errors.js'

export const listEnrollmentsHandler = asyncHandler(async (req, res) => {
  const query = { ...req.validatedQuery }

  if (req.user.role === 'student') {
    query.studentId = req.user.studentId
  } else if (req.user.role === 'parent') {
    if (!query.studentId) throw new BadRequestError('studentId is required')
    await assertCanViewStudent(req.user, query.studentId)
  }

  res.json(await getEnrollments(query))
})

export const createEnrollmentHandler = asyncHandler(async (req, res) => {
  const enrollment = await enrollStudent(req.body)
  res.status(201).json({ data: enrollment })
})

export const dropEnrollmentHandler = asyncHandler(async (req, res) => {
  const enrollment = await dropEnrollment(Number(req.params.id))
  res.json({ data: enrollment })
})
