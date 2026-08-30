import { asyncHandler } from '../utils/asyncHandler.js'
import {
  getExamsForClass,
  createExam,
  editExam,
  getExamWithRoster,
  saveMarks,
} from '../services/exam.service.js'

export const listExamsHandler = asyncHandler(async (req, res) => {
  const classId = Number(req.query.classId)
  res.json({ data: await getExamsForClass(req.user, classId) })
})

export const createExamHandler = asyncHandler(async (req, res) => {
  const exam = await createExam(req.user, req.body)
  res.status(201).json({ data: exam })
})

export const updateExamHandler = asyncHandler(async (req, res) => {
  const exam = await editExam(req.user, Number(req.params.id), req.body)
  res.json({ data: exam })
})

export const getExamHandler = asyncHandler(async (req, res) => {
  const exam = await getExamWithRoster(req.user, Number(req.params.id))
  res.json({ data: exam })
})

export const saveMarksHandler = asyncHandler(async (req, res) => {
  const exam = await saveMarks(req.user, Number(req.params.id), req.body.records)
  res.json({ data: exam })
})
