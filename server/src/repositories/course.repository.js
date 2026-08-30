import { pool } from '../config/db.js'

const LIST_COLUMNS = `
  c.id, c.name, c.code, c.department_id, c.credit_hours, c.description, c.is_active, c.created_at,
  d.name AS department_name
`

export async function listCourses({ search, departmentId, isActive, limit, offset }) {
  const where = []
  const params = []

  if (search) {
    where.push('(c.name LIKE ? OR c.code LIKE ?)')
    const like = `%${search}%`
    params.push(like, like)
  }
  if (departmentId) {
    where.push('c.department_id = ?')
    params.push(departmentId)
  }
  if (isActive !== undefined) {
    where.push('c.is_active = ?')
    params.push(isActive)
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const [rows] = await pool.query(
    `SELECT ${LIST_COLUMNS}
     FROM courses c
     LEFT JOIN departments d ON d.id = c.department_id
     ${whereSql}
     ORDER BY c.name
     LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  )

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM courses c ${whereSql}`, params)

  return { rows, total }
}

export async function findCourseById(id) {
  const [rows] = await pool.query(
    `SELECT ${LIST_COLUMNS} FROM courses c LEFT JOIN departments d ON d.id = c.department_id WHERE c.id = ?`,
    [id],
  )
  return rows[0] ?? null
}

export async function findCourseByCode(code) {
  const [rows] = await pool.query('SELECT id FROM courses WHERE code = ? LIMIT 1', [code])
  return rows[0] ?? null
}

export async function insertCourse(data) {
  const [result] = await pool.query(
    `INSERT INTO courses (name, code, department_id, credit_hours, description)
     VALUES (?, ?, ?, ?, ?)`,
    [data.name, data.code, data.departmentId, data.creditHours ?? 1, data.description ?? null],
  )
  return result.insertId
}

export async function updateCourse(id, data) {
  await pool.query(
    `UPDATE courses SET name = ?, code = ?, department_id = ?, credit_hours = ?, description = ?
     WHERE id = ?`,
    [data.name, data.code, data.departmentId, data.creditHours ?? 1, data.description ?? null, id],
  )
}

export async function setCourseActive(id, isActive) {
  await pool.query('UPDATE courses SET is_active = ? WHERE id = ?', [isActive, id])
}
