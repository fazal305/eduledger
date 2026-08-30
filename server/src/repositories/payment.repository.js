import { pool } from '../config/db.js'

export async function listPaymentsForFee(feeId) {
  const [rows] = await pool.query(
    `SELECT p.id, p.fee_id, p.amount, p.payment_date, p.method, p.reference, p.created_at,
            u.name AS recorded_by_name
     FROM payments p
     LEFT JOIN users u ON u.id = p.recorded_by
     WHERE p.fee_id = ?
     ORDER BY p.payment_date DESC, p.id DESC`,
    [feeId],
  )
  return rows
}

export async function insertPayment(data, recordedBy) {
  const [result] = await pool.query(
    `INSERT INTO payments (fee_id, amount, payment_date, method, reference, recorded_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.feeId, data.amount, data.paymentDate, data.method, data.reference ?? null, recordedBy],
  )
  return result.insertId
}
