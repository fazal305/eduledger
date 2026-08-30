import { pool } from '../config/db.js'

const LIST_COLUMNS = `
  t.id, t.first_name, t.last_name, t.email, t.phone, t.department_id,
  t.hire_date, t.is_active, t.created_at, d.name AS department_name
`

export async function listTeachers({ search, departmentId, isActive, limit, offset }) {
  const where = []
  const params = []

  if (search) {
    where.push('(t.first_name LIKE ? OR t.last_name LIKE ? OR t.email LIKE ?)')
    const like = `%${search}%`
    params.push(like, like, like)
  }
  if (departmentId) {
    where.push('t.department_id = ?')
    params.push(departmentId)
  }
  if (isActive !== undefined) {
    where.push('t.is_active = ?')
    params.push(isActive)
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const [rows] = await pool.query(
    `SELECT ${LIST_COLUMNS}
     FROM teachers t
     LEFT JOIN departments d ON d.id = t.department_id
     ${whereSql}
     ORDER BY t.last_name, t.first_name
     LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  )

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM teachers t ${whereSql}`,
    params,
  )

  return { rows, total }
}

export async function findTeacherById(id) {
  const [rows] = await pool.query(
    `SELECT ${LIST_COLUMNS} FROM teachers t LEFT JOIN departments d ON d.id = t.department_id WHERE t.id = ?`,
    [id],
  )
  return rows[0] ?? null
}

export async function findTeacherByEmail(email) {
  const [rows] = await pool.query('SELECT id FROM teachers WHERE email = ? LIMIT 1', [email])
  return rows[0] ?? null
}

export async function insertTeacher(data) {
  const [result] = await pool.query(
    `INSERT INTO teachers (first_name, last_name, email, phone, department_id, hire_date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.firstName, data.lastName, data.email, data.phone ?? null, data.departmentId ?? null, data.hireDate ?? null],
  )
  return result.insertId
}

export async function updateTeacher(id, data) {
  await pool.query(
    `UPDATE teachers SET first_name = ?, last_name = ?, email = ?, phone = ?, department_id = ?, hire_date = ?
     WHERE id = ?`,
    [data.firstName, data.lastName, data.email, data.phone ?? null, data.departmentId ?? null, data.hireDate ?? null, id],
  )
}

export async function setTeacherActive(id, isActive) {
  await pool.query('UPDATE teachers SET is_active = ? WHERE id = ?', [isActive, id])
}

export async function getTeacherClasses(teacherId) {
  const [rows] = await pool.query(
    `SELECT c.id, co.name AS course_name, sec.name AS section_name, c.schedule_day, c.start_time, c.end_time, c.room
     FROM classes c
     JOIN courses co ON co.id = c.course_id
     JOIN sections sec ON sec.id = c.section_id
     WHERE c.teacher_id = ? AND c.is_active = TRUE
     ORDER BY c.schedule_day, c.start_time`,
    [teacherId],
  )
  return rows
}
