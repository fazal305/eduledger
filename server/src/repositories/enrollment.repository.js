import { pool } from '../config/db.js'

const LIST_COLUMNS = `
  e.id, e.student_id, e.class_id, e.enrolled_at, e.status, e.created_at,
  s.student_number, s.first_name AS student_first_name, s.last_name AS student_last_name,
  co.name AS course_name, sec.name AS section_name, ay.name AS academic_year_name
`

const JOINS = `
  JOIN students s ON s.id = e.student_id
  JOIN classes cl ON cl.id = e.class_id
  JOIN courses co ON co.id = cl.course_id
  JOIN sections sec ON sec.id = cl.section_id
  JOIN academic_years ay ON ay.id = cl.academic_year_id
`

export async function listEnrollments({ studentId, classId, status, limit, offset }) {
  const where = []
  const params = []

  if (studentId) {
    where.push('e.student_id = ?')
    params.push(studentId)
  }
  if (classId) {
    where.push('e.class_id = ?')
    params.push(classId)
  }
  if (status) {
    where.push('e.status = ?')
    params.push(status)
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const [rows] = await pool.query(
    `SELECT ${LIST_COLUMNS} FROM enrollments e ${JOINS} ${whereSql}
     ORDER BY e.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  )

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM enrollments e ${JOINS} ${whereSql}`,
    params,
  )

  return { rows, total }
}

export async function findEnrollment(studentId, classId) {
  const [rows] = await pool.query(
    'SELECT id, status FROM enrollments WHERE student_id = ? AND class_id = ?',
    [studentId, classId],
  )
  return rows[0] ?? null
}

export async function findEnrollmentById(id) {
  const [rows] = await pool.query(`SELECT ${LIST_COLUMNS} FROM enrollments e ${JOINS} WHERE e.id = ?`, [id])
  return rows[0] ?? null
}

export async function insertEnrollment(studentId, classId, enrolledAt) {
  const [result] = await pool.query(
    'INSERT INTO enrollments (student_id, class_id, enrolled_at, status) VALUES (?, ?, ?, \'active\')',
    [studentId, classId, enrolledAt],
  )
  return result.insertId
}

export async function reactivateEnrollment(id, enrolledAt) {
  await pool.query(
    'UPDATE enrollments SET status = \'active\', enrolled_at = ? WHERE id = ?',
    [enrolledAt, id],
  )
}

export async function setEnrollmentStatus(id, status) {
  await pool.query('UPDATE enrollments SET status = ? WHERE id = ?', [status, id])
}

export async function studentExists(studentId) {
  const [rows] = await pool.query('SELECT id FROM students WHERE id = ?', [studentId])
  return !!rows[0]
}

export async function classExists(classId) {
  const [rows] = await pool.query('SELECT id FROM classes WHERE id = ?', [classId])
  return !!rows[0]
}
