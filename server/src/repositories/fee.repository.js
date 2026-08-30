import { pool } from '../config/db.js'

const LIST_COLUMNS = `
  f.id, f.student_id, f.fee_type_id, f.academic_year_id, f.amount, f.due_date, f.created_at,
  CASE WHEN f.status IN ('pending','partially_paid') AND f.due_date < CURDATE()
       THEN 'overdue' ELSE f.status END AS status,
  COALESCE(p.paid_amount, 0) AS paid_amount,
  f.amount - COALESCE(p.paid_amount, 0) AS remaining_amount,
  s.student_number, s.first_name AS student_first_name, s.last_name AS student_last_name,
  ft.name AS fee_type_name, ay.name AS academic_year_name
`

const JOINS = `
  JOIN students s ON s.id = f.student_id
  JOIN fee_types ft ON ft.id = f.fee_type_id
  JOIN academic_years ay ON ay.id = f.academic_year_id
  LEFT JOIN (SELECT fee_id, SUM(amount) AS paid_amount FROM payments GROUP BY fee_id) p ON p.fee_id = f.id
`

export async function listFees({ studentId, status, academicYearId, limit, offset }) {
  const where = []
  const params = []

  if (studentId) {
    where.push('f.student_id = ?')
    params.push(studentId)
  }
  if (academicYearId) {
    where.push('f.academic_year_id = ?')
    params.push(academicYearId)
  }
  if (status) {
    where.push(
      `CASE WHEN f.status IN ('pending','partially_paid') AND f.due_date < CURDATE() THEN 'overdue' ELSE f.status END = ?`,
    )
    params.push(status)
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const [rows] = await pool.query(
    `SELECT ${LIST_COLUMNS} FROM fees f ${JOINS} ${whereSql}
     ORDER BY f.due_date DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  )

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM fees f ${whereSql}`, params)

  return { rows, total }
}

export async function findFeeById(id) {
  const [rows] = await pool.query(`SELECT ${LIST_COLUMNS} FROM fees f ${JOINS} WHERE f.id = ?`, [id])
  return rows[0] ?? null
}

export async function insertFee(data) {
  const [result] = await pool.query(
    `INSERT INTO fees (student_id, fee_type_id, academic_year_id, amount, due_date) VALUES (?, ?, ?, ?, ?)`,
    [data.studentId, data.feeTypeId, data.academicYearId, data.amount, data.dueDate],
  )
  return result.insertId
}

export async function updateFeeStoredStatus(id, status) {
  await pool.query('UPDATE fees SET status = ? WHERE id = ?', [status, id])
}

export async function getFeeTotals(id) {
  const [rows] = await pool.query(
    `SELECT f.amount, f.due_date, COALESCE(SUM(p.amount), 0) AS paid_amount
     FROM fees f
     LEFT JOIN payments p ON p.fee_id = f.id
     WHERE f.id = ?
     GROUP BY f.id`,
    [id],
  )
  return rows[0] ?? null
}

export async function getFeeSummary(academicYearId) {
  const params = []
  let where = ''
  if (academicYearId) {
    where = 'WHERE f.academic_year_id = ?'
    params.push(academicYearId)
  }
  const [[row]] = await pool.query(
    `SELECT
       COALESCE(SUM(f.amount), 0) AS total_billed,
       COALESCE(SUM(p.paid_amount), 0) AS total_collected,
       COALESCE(SUM(f.amount - COALESCE(p.paid_amount, 0)), 0) AS total_outstanding
     FROM fees f
     LEFT JOIN (SELECT fee_id, SUM(amount) AS paid_amount FROM payments GROUP BY fee_id) p ON p.fee_id = f.id
     ${where}`,
    params,
  )
  return row
}
