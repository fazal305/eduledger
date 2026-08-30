import {
  listDepartments,
  listAcademicYears,
  listSections,
  listFeeTypes,
} from '../repositories/reference.repository.js'

export async function getDepartments(req, res) {
  res.json({ data: await listDepartments() })
}

export async function getAcademicYears(req, res) {
  res.json({ data: await listAcademicYears() })
}

export async function getSections(req, res) {
  const academicYearId = req.query.academicYearId ? Number(req.query.academicYearId) : undefined
  res.json({ data: await listSections(academicYearId) })
}

export async function getFeeTypes(req, res) {
  res.json({ data: await listFeeTypes() })
}
