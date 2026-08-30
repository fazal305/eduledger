import { pool } from '../config/db.js'

const LIST_COLUMNS = `
  ex.id, ex.class_id, ex.name, ex.exam_date, ex.max_marks, ex.created_at,
  co.name AS course_name, sec.name AS section_name
`

export async function listExamsForClass(classId) {
  const [rows] = await pool.query(
    `SELECT ${LIST_COLUMNS}
     FROM exams ex
     JOIN classes cl ON cl.id = ex.class_id
     JOIN courses co ON co.id = cl.course_id
     JOIN sections sec ON sec.id = cl.section_id
     WHERE ex.class_id = ?
     ORDER BY ex.exam_date DESC`,
    [classId],
  )
  return rows
}

export async function findExamById(id) {
  const [rows] = await pool.query(
    `SELECT ${LIST_COLUMNS}
     FROM exams ex
     JOIN classes cl ON cl.id = ex.class_id
     JOIN courses co ON co.id = cl.course_id
     JOIN sections sec ON sec.id = cl.section_id
     WHERE ex.id = ?`,
    [id],
  )
  return rows[0] ?? null
}

export async function insertExam(data, createdBy) {
  const [result] = await pool.query(
    `INSERT INTO exams (class_id, name, exam_date, max_marks, created_by) VALUES (?, ?, ?, ?, ?)`,
    [data.classId, data.name, data.examDate, data.maxMarks, createdBy],
  )
  return result.insertId
}

export async function updateExam(id, data) {
  await pool.query(
    `UPDATE exams SET name = ?, exam_date = ?, max_marks = ? WHERE id = ?`,
    [data.name, data.examDate, data.maxMarks, id],
  )
}

export async function getExamClassId(examId) {
  const [rows] = await pool.query('SELECT class_id FROM exams WHERE id = ?', [examId])
  return rows[0]?.class_id ?? null
}
