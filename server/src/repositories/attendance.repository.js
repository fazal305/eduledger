import { pool } from '../config/db.js'

export async function listRosterWithAttendance(classId, date) {
  const [rows] = await pool.query(
    `SELECT s.id AS student_id, s.student_number, s.first_name, s.last_name, a.status
     FROM enrollments e
     JOIN students s ON s.id = e.student_id
     LEFT JOIN attendance a ON a.class_id = e.class_id AND a.student_id = s.id AND a.date = ?
     WHERE e.class_id = ? AND e.status = 'active'
     ORDER BY s.last_name, s.first_name`,
    [date, classId],
  )
  return rows
}

export async function upsertAttendanceRecords(classId, date, records, recordedBy) {
  if (records.length === 0) return
  const values = records.map((r) => [classId, r.studentId, date, r.status, recordedBy])
  await pool.query(
    `INSERT INTO attendance (class_id, student_id, date, status, recorded_by)
     VALUES ?
     ON DUPLICATE KEY UPDATE status = VALUES(status), recorded_by = VALUES(recorded_by)`,
    [values],
  )
}

export async function getAttendanceSummary(studentId) {
  const [rows] = await pool.query(
    `SELECT status, COUNT(*) AS count FROM attendance WHERE student_id = ? GROUP BY status`,
    [studentId],
  )
  const summary = { present: 0, absent: 0, late: 0, excused: 0 }
  for (const row of rows) summary[row.status] = row.count
  return summary
}

export async function getAttendanceHistory(studentId, classId) {
  const params = [studentId]
  let sql = `
    SELECT a.date, a.status, co.name AS course_name
    FROM attendance a
    JOIN classes cl ON cl.id = a.class_id
    JOIN courses co ON co.id = cl.course_id
    WHERE a.student_id = ?
  `
  if (classId) {
    sql += ' AND a.class_id = ?'
    params.push(classId)
  }
  sql += ' ORDER BY a.date DESC LIMIT 200'
  const [rows] = await pool.query(sql, params)
  return rows
}
