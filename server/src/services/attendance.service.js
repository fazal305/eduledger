import {
  listRosterWithAttendance,
  upsertAttendanceRecords,
  getAttendanceSummary,
  getAttendanceHistory,
} from '../repositories/attendance.repository.js'
import { assertCanManageClass } from './classAccess.service.js'

export async function getAttendanceForClassDate(user, classId, date) {
  await assertCanManageClass(user, classId)
  return listRosterWithAttendance(classId, date)
}

export async function saveAttendance(user, { classId, date, records }) {
  await assertCanManageClass(user, classId)
  await upsertAttendanceRecords(classId, date, records, user.id)
  return listRosterWithAttendance(classId, date)
}

export async function getStudentAttendanceSummary(studentId) {
  return getAttendanceSummary(studentId)
}

export async function getStudentAttendanceHistory(studentId, classId) {
  return getAttendanceHistory(studentId, classId)
}
