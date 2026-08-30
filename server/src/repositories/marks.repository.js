import { pool } from '../config/db.js'

export async function listRosterWithMarks(examId, classId) {
  const [rows] = await pool.query(
    `SELECT s.id AS student_id, s.student_number, s.first_name, s.last_name,
            m.obtained_marks, m.grade, m.remarks
     FROM enrollments e
     JOIN students s ON s.id = e.student_id
     LEFT JOIN marks m ON m.exam_id = ? AND m.student_id = s.id
     WHERE e.class_id = ? AND e.status = 'active'
     ORDER BY s.last_name, s.first_name`,
    [examId, classId],
  )
  return rows
}

export async function upsertMarks(examId, records) {
  if (records.length === 0) return
  const values = records.map((r) => [examId, r.studentId, r.obtainedMarks, r.grade, r.remarks ?? null])
  await pool.query(
    `INSERT INTO marks (exam_id, student_id, obtained_marks, grade, remarks)
     VALUES ?
     ON DUPLICATE KEY UPDATE obtained_marks = VALUES(obtained_marks), grade = VALUES(grade), remarks = VALUES(remarks)`,
    [values],
  )
}

export async function getStudentReportCardMarks(studentId, academicYearId) {
  const [rows] = await pool.query(
    `SELECT co.name AS course_name, ex.name AS exam_name, ex.exam_date, ex.max_marks,
            m.obtained_marks, m.grade
     FROM marks m
     JOIN exams ex ON ex.id = m.exam_id
     JOIN classes cl ON cl.id = ex.class_id
     JOIN courses co ON co.id = cl.course_id
     WHERE m.student_id = ? AND cl.academic_year_id = ?
     ORDER BY co.name, ex.exam_date`,
    [studentId, academicYearId],
  )
  return rows
}
