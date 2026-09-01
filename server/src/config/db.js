import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'
import { env } from './env.js'

const caCertPath = fileURLToPath(new URL('../certs/aiven-ca.pem', import.meta.url))

function resolveSsl() {
  if (!env.DB_SSL) return undefined
  try {
    return { ca: readFileSync(caCertPath, 'utf8'), rejectUnauthorized: true }
  } catch {
    return { rejectUnauthorized: true }
  }
}

export const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  ssl: resolveSsl(),
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,
})
