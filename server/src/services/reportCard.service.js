import { getStudentForReportCard } from '../repositories/reportCard.repository.js'
import { getStudentReportCardMarks } from '../repositories/marks.repository.js'
import { getAttendanceSummary } from '../repositories/attendance.repository.js'
import { getCurrentAcademicYear, listAcademicYears } from '../repositories/reference.repository.js'
import { NotFoundError } from '../utils/errors.js'

function groupByCourse(marksRows) {
  const byCourse = new Map()
  for (const row of marksRows) {
    if (!byCourse.has(row.course_name)) byCourse.set(row.course_name, [])
    byCourse.get(row.course_name).push({
      examName: row.exam_name,
      examDate: row.exam_date,
      maxMarks: row.max_marks,
      obtainedMarks: row.obtained_marks,
      grade: row.grade,
    })
  }
  return Array.from(byCourse.entries()).map(([courseName, exams]) => {
    const totalMax = exams.reduce((sum, e) => sum + e.maxMarks, 0)
    const totalObtained = exams.reduce((sum, e) => sum + Number(e.obtainedMarks ?? 0), 0)
    return {
      courseName,
      exams,
      totalMax,
      totalObtained,
      percentage: totalMax > 0 ? Math.round((totalObtained / totalMax) * 1000) / 10 : null,
    }
  })
}

export async function buildReportCard(studentId, academicYearId) {
  const student = await getStudentForReportCard(studentId)
  if (!student) throw new NotFoundError('Student not found')

  const years = await listAcademicYears()
  const year = academicYearId
    ? years.find((y) => y.id === academicYearId)
    : (await getCurrentAcademicYear()) ?? years[0]
  if (!year) throw new NotFoundError('No academic year found')

  const [marksRows, attendance] = await Promise.all([
    getStudentReportCardMarks(studentId, year.id),
    getAttendanceSummary(studentId),
  ])

  const courses = groupByCourse(marksRows)
  const overallMax = courses.reduce((sum, c) => sum + c.totalMax, 0)
  const overallObtained = courses.reduce((sum, c) => sum + c.totalObtained, 0)
  const overallPercentage = overallMax > 0 ? Math.round((overallObtained / overallMax) * 1000) / 10 : null

  return {
    student,
    academicYear: year,
    courses,
    attendance,
    overall: {
      totalMax: overallMax,
      totalObtained: overallObtained,
      percentage: overallPercentage,
      result: overallPercentage === null ? 'No exams recorded' : overallPercentage >= 50 ? 'Pass' : 'Fail',
    },
  }
}
