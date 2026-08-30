import { pool } from '../config/db.js'

const LIST_COLUMNS = `
  s.id, s.student_number, s.first_name, s.last_name, s.date_of_birth, s.gender,
  s.admission_date, s.section_id, s.is_active, s.created_at,
  sec.name AS section_name, sec.grade_level AS grade_level
`

export async function listStudents({ search, sectionId, isActive, sortBy, sortDir, limit, offset }) {
  const where = []
  const params = []

  if (search) {
    where.push('(s.first_name LIKE ? OR s.last_name LIKE ? OR s.student_number LIKE ?)')
    const like = `%${search}%`
    params.push(like, like, like)
  }
  if (sectionId) {
    where.push('s.section_id = ?')
    params.push(sectionId)
  }
  if (isActive !== undefined) {
    where.push('s.is_active = ?')
    params.push(isActive)
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const sortColumn = { name: 's.last_name', admission_date: 's.admission_date', student_number: 's.student_number' }[sortBy] ?? 's.last_name'
  const sortDirSql = sortDir === 'desc' ? 'DESC' : 'ASC'

  const [rows] = await pool.query(
    `SELECT ${LIST_COLUMNS}
     FROM students s
     LEFT JOIN sections sec ON sec.id = s.section_id
     ${whereSql}
     ORDER BY ${sortColumn} ${sortDirSql}
     LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  )

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM students s ${whereSql}`,
    params,
  )

  return { rows, total }
}

export async function findStudentById(id) {
  const [rows] = await pool.query(
    `SELECT ${LIST_COLUMNS} FROM students s LEFT JOIN sections sec ON sec.id = s.section_id WHERE s.id = ?`,
    [id],
  )
  return rows[0] ?? null
}

export async function insertStudent(data) {
  const [result] = await pool.query(
    `INSERT INTO students (student_number, first_name, last_name, date_of_birth, gender, admission_date, section_id)
     VALUES ('PENDING', ?, ?, ?, ?, ?, ?)`,
    [data.firstName, data.lastName, data.dateOfBirth, data.gender, data.admissionDate, data.sectionId ?? null],
  )
  const id = result.insertId
  const studentNumber = `STU-${String(id).padStart(6, '0')}`
  await pool.query('UPDATE students SET student_number = ? WHERE id = ?', [studentNumber, id])
  return id
}

export async function updateStudent(id, data) {
  await pool.query(
    `UPDATE students SET first_name = ?, last_name = ?, date_of_birth = ?, gender = ?, section_id = ?
     WHERE id = ?`,
    [data.firstName, data.lastName, data.dateOfBirth, data.gender, data.sectionId ?? null, id],
  )
}

export async function setStudentActive(id, isActive) {
  await pool.query('UPDATE students SET is_active = ? WHERE id = ?', [isActive, id])
}

export async function getStudentGuardians(studentId) {
  const [rows] = await pool.query(
    `SELECT p.id, p.first_name, p.last_name, p.email, p.phone, ps.relationship
     FROM parent_student ps
     JOIN parents p ON p.id = ps.parent_id
     WHERE ps.student_id = ?`,
    [studentId],
  )
  return rows
}
