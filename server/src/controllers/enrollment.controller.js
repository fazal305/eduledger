import { asyncHandler } from '../utils/asyncHandler.js'
import { getEnrollments, enrollStudent, dropEnrollment } from '../services/enrollment.service.js'

export const listEnrollmentsHandler = asyncHandler(async (req, res) => {
  res.json(await getEnrollments(req.validatedQuery))
})

export const createEnrollmentHandler = asyncHandler(async (req, res) => {
  const enrollment = await enrollStudent(req.body)
  res.status(201).json({ data: enrollment })
})

export const dropEnrollmentHandler = asyncHandler(async (req, res) => {
  const enrollment = await dropEnrollment(Number(req.params.id))
  res.json({ data: enrollment })
})
