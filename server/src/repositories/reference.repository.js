import { pool } from '../config/db.js'

export async function listDepartments() {
  const [rows] = await pool.query('SELECT id, name, code FROM departments ORDER BY name')
  return rows
}

export async function listAcademicYears() {
  const [rows] = await pool.query(
    'SELECT id, name, start_date, end_date, is_current FROM academic_years ORDER BY start_date DESC',
  )
  return rows
}

export async function getCurrentAcademicYear() {
  const [rows] = await pool.query(
    'SELECT id, name, start_date, end_date, is_current FROM academic_years WHERE is_current = TRUE LIMIT 1',
  )
  return rows[0] ?? null
}

export async function listSections(academicYearId) {
  const params = []
  let sql = 'SELECT id, name, grade_level, academic_year_id, capacity FROM sections'
  if (academicYearId) {
    sql += ' WHERE academic_year_id = ?'
    params.push(academicYearId)
  }
  sql += ' ORDER BY grade_level, name'
  const [rows] = await pool.query(sql, params)
  return rows
}

export async function listFeeTypes() {
  const [rows] = await pool.query('SELECT id, name, description FROM fee_types ORDER BY name')
  return rows
}
