import { asyncHandler } from '../utils/asyncHandler.js'
import { getCourses, getCourse, createCourse, editCourse, archiveCourse } from '../services/course.service.js'

export const listCoursesHandler = asyncHandler(async (req, res) => {
  res.json(await getCourses(req.validatedQuery))
})

export const getCourseHandler = asyncHandler(async (req, res) => {
  res.json({ data: await getCourse(Number(req.params.id)) })
})

export const createCourseHandler = asyncHandler(async (req, res) => {
  const course = await createCourse(req.body)
  res.status(201).json({ data: course })
})

export const updateCourseHandler = asyncHandler(async (req, res) => {
  const course = await editCourse(Number(req.params.id), req.body)
  res.json({ data: course })
})

export const setCourseActiveHandler = asyncHandler(async (req, res) => {
  const course = await archiveCourse(Number(req.params.id), req.body.isActive)
  res.json({ data: course })
})
