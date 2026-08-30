import { asyncHandler } from '../utils/asyncHandler.js'
import { getClasses, getClassProfile, createClass, editClass, archiveClass } from '../services/class.service.js'

export const listClassesHandler = asyncHandler(async (req, res) => {
  res.json(await getClasses(req.validatedQuery))
})

export const getClassHandler = asyncHandler(async (req, res) => {
  res.json({ data: await getClassProfile(Number(req.params.id)) })
})

export const createClassHandler = asyncHandler(async (req, res) => {
  const klass = await createClass(req.body)
  res.status(201).json({ data: klass })
})

export const updateClassHandler = asyncHandler(async (req, res) => {
  const klass = await editClass(Number(req.params.id), req.body)
  res.json({ data: klass })
})

export const setClassActiveHandler = asyncHandler(async (req, res) => {
  const klass = await archiveClass(Number(req.params.id), req.body.isActive)
  res.json({ data: klass })
})
