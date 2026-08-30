import { pool } from '../config/db.js'

export async function getChildrenForParent(parentId) {
  const [rows] = await pool.query(
    `SELECT s.id, s.student_number, s.first_name, s.last_name, sec.name AS section_name, ps.relationship
     FROM parent_student ps
     JOIN students s ON s.id = ps.student_id
     LEFT JOIN sections sec ON sec.id = s.section_id
     WHERE ps.parent_id = ?
     ORDER BY s.first_name`,
    [parentId],
  )
  return rows
}

export async function isParentOfStudent(parentId, studentId) {
  const [rows] = await pool.query(
    'SELECT 1 FROM parent_student WHERE parent_id = ? AND student_id = ? LIMIT 1',
    [parentId, studentId],
  )
  return rows.length > 0
}
