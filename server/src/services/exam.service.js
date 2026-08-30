import {
  listExamsForClass,
  findExamById,
  insertExam,
  updateExam,
  getExamClassId,
} from '../repositories/exam.repository.js'
import { listRosterWithMarks, upsertMarks } from '../repositories/marks.repository.js'
import { assertCanManageClass } from './classAccess.service.js'
import { computeGrade } from '../utils/grading.js'
import { NotFoundError, BadRequestError } from '../utils/errors.js'

export async function getExamsForClass(user, classId) {
  await assertCanManageClass(user, classId)
  return listExamsForClass(classId)
}

export async function createExam(user, data) {
  await assertCanManageClass(user, data.classId)
  const id = await insertExam(data, user.id)
  return findExamById(id)
}

export async function editExam(user, examId, data) {
  const classId = await getExamClassId(examId)
  if (!classId) throw new NotFoundError('Exam not found')
  await assertCanManageClass(user, classId)
  if (data.classId !== classId) throw new BadRequestError('Exam cannot be moved to a different class')
  await updateExam(examId, data)
  return findExamById(examId)
}

export async function getExamWithRoster(user, examId) {
  const exam = await findExamById(examId)
  if (!exam) throw new NotFoundError('Exam not found')
  await assertCanManageClass(user, exam.class_id)
  const roster = await listRosterWithMarks(examId, exam.class_id)
  return { ...exam, roster }
}

export async function saveMarks(user, examId, records) {
  const exam = await findExamById(examId)
  if (!exam) throw new NotFoundError('Exam not found')
  await assertCanManageClass(user, exam.class_id)

  for (const record of records) {
    if (record.obtainedMarks > exam.max_marks) {
      throw new BadRequestError(
        `Obtained marks (${record.obtainedMarks}) cannot exceed the exam's max marks (${exam.max_marks})`,
      )
    }
  }

  const withGrades = records.map((r) => ({
    ...r,
    grade: computeGrade(r.obtainedMarks, exam.max_marks),
  }))
  await upsertMarks(examId, withGrades)

  const roster = await listRosterWithMarks(examId, exam.class_id)
  return { ...exam, roster }
}
