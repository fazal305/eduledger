import { pool } from '../config/db.js'

const LIST_COLUMNS = `
  cl.id, cl.course_id, cl.section_id, cl.academic_year_id, cl.teacher_id,
  cl.room, cl.schedule_day, cl.start_time, cl.end_time, cl.is_active, cl.created_at,
  co.name AS course_name, co.code AS course_code,
  sec.name AS section_name,
  ay.name AS academic_year_name,
  CONCAT(t.first_name, ' ', t.last_name) AS teacher_name
`

export async function listClasses({ search, academicYearId, teacherId, sectionId, isActive, limit, offset }) {
  const where = []
  const params = []

  if (search) {
    where.push('(co.name LIKE ? OR co.code LIKE ? OR sec.name LIKE ?)')
    const like = `%${search}%`
    params.push(like, like, like)
  }
  if (academicYearId) {
    where.push('cl.academic_year_id = ?')
    params.push(academicYearId)
  }
  if (teacherId) {
    where.push('cl.teacher_id = ?')
    params.push(teacherId)
  }
  if (sectionId) {
    where.push('cl.section_id = ?')
    params.push(sectionId)
  }
  if (isActive !== undefined) {
    where.push('cl.is_active = ?')
    params.push(isActive)
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const joins = `
    JOIN courses co ON co.id = cl.course_id
    JOIN sections sec ON sec.id = cl.section_id
    JOIN academic_years ay ON ay.id = cl.academic_year_id
    LEFT JOIN teachers t ON t.id = cl.teacher_id
  `

  const [rows] = await pool.query(
    `SELECT ${LIST_COLUMNS} FROM classes cl ${joins} ${whereSql}
     ORDER BY co.name, sec.name
     LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  )

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM classes cl ${joins} ${whereSql}`,
    params,
  )

  return { rows, total }
}

export async function findClassById(id) {
  const [rows] = await pool.query(
    `SELECT ${LIST_COLUMNS}
     FROM classes cl
     JOIN courses co ON co.id = cl.course_id
     JOIN sections sec ON sec.id = cl.section_id
     JOIN academic_years ay ON ay.id = cl.academic_year_id
     LEFT JOIN teachers t ON t.id = cl.teacher_id
     WHERE cl.id = ?`,
    [id],
  )
  return rows[0] ?? null
}

export async function findClassByCombo(courseId, sectionId, academicYearId, excludeId) {
  const params = [courseId, sectionId, academicYearId]
  let sql = 'SELECT id FROM classes WHERE course_id = ? AND section_id = ? AND academic_year_id = ?'
  if (excludeId) {
    sql += ' AND id != ?'
    params.push(excludeId)
  }
  const [rows] = await pool.query(sql, params)
  return rows[0] ?? null
}

export async function insertClass(data) {
  const [result] = await pool.query(
    `INSERT INTO classes (course_id, section_id, academic_year_id, teacher_id, room, schedule_day, start_time, end_time)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.courseId,
      data.sectionId,
      data.academicYearId,
      data.teacherId ?? null,
      data.room ?? null,
      data.scheduleDay ?? null,
      data.startTime ?? null,
      data.endTime ?? null,
    ],
  )
  return result.insertId
}

export async function updateClass(id, data) {
  await pool.query(
    `UPDATE classes SET course_id = ?, section_id = ?, academic_year_id = ?, teacher_id = ?,
     room = ?, schedule_day = ?, start_time = ?, end_time = ?
     WHERE id = ?`,
    [
      data.courseId,
      data.sectionId,
      data.academicYearId,
      data.teacherId ?? null,
      data.room ?? null,
      data.scheduleDay ?? null,
      data.startTime ?? null,
      data.endTime ?? null,
      id,
    ],
  )
}

export async function setClassActive(id, isActive) {
  await pool.query('UPDATE classes SET is_active = ? WHERE id = ?', [isActive, id])
}

export async function getClassTeacherId(classId) {
  const [rows] = await pool.query('SELECT teacher_id FROM classes WHERE id = ?', [classId])
  return rows[0]?.teacher_id ?? null
}

export async function classActiveExists(classId) {
  const [rows] = await pool.query('SELECT id FROM classes WHERE id = ?', [classId])
  return !!rows[0]
}

export async function getClassRoster(classId) {
  const [rows] = await pool.query(
    `SELECT s.id, s.student_number, s.first_name, s.last_name, e.status, e.enrolled_at
     FROM enrollments e
     JOIN students s ON s.id = e.student_id
     WHERE e.class_id = ? AND e.status = 'active'
     ORDER BY s.last_name, s.first_name`,
    [classId],
  )
  return rows
}
