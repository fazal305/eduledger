import { pool } from '../config/db.js'

export async function getStudentForReportCard(studentId) {
  const [rows] = await pool.query(
    `SELECT s.id, s.student_number, s.first_name, s.last_name, sec.name AS section_name
     FROM students s
     LEFT JOIN sections sec ON sec.id = s.section_id
     WHERE s.id = ?`,
    [studentId],
  )
  return rows[0] ?? null
}
