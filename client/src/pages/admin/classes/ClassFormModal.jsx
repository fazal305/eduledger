import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import FormField, { inputClass } from '../../../components/ui/FormField'
import { classFormSchema } from '../../../schemas/class'
import { createClass, updateClass } from '../../../services/classService'
import { fetchAcademicYears, fetchSections } from '../../../services/referenceService'
import { fetchCourses } from '../../../services/courseService'
import { fetchTeachers } from '../../../services/teacherService'

const DAYS = [
  { value: '', label: 'No fixed day' },
  { value: 'mon', label: 'Monday' },
  { value: 'tue', label: 'Tuesday' },
  { value: 'wed', label: 'Wednesday' },
  { value: 'thu', label: 'Thursday' },
  { value: 'fri', label: 'Friday' },
  { value: 'sat', label: 'Saturday' },
  { value: 'sun', label: 'Sunday' },
]

export default function ClassFormModal({ klass, onClose, onSuccess }) {
  const isEdit = !!klass
  const [serverError, setServerError] = useState('')

  const { data: courses } = useQuery({ queryKey: ['courses', 'all'], queryFn: () => fetchCourses({ isActive: 'true', pageSize: 100 }) })
  const { data: sections } = useQuery({ queryKey: ['sections'], queryFn: () => fetchSections() })
  const { data: academicYears } = useQuery({ queryKey: ['academicYears'], queryFn: fetchAcademicYears })
  const { data: teachers } = useQuery({ queryKey: ['teachers', 'all'], queryFn: () => fetchTeachers({ isActive: 'true', pageSize: 100 }) })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(classFormSchema),
    defaultValues: klass
      ? {
          courseId: klass.course_id,
          sectionId: klass.section_id,
          academicYearId: klass.academic_year_id,
          teacherId: klass.teacher_id ?? '',
          room: klass.room ?? '',
          scheduleDay: klass.schedule_day ?? '',
          startTime: klass.start_time?.slice(0, 5) ?? '',
          endTime: klass.end_time?.slice(0, 5) ?? '',
        }
      : { teacherId: '', scheduleDay: '' },
  })

  const mutation = useMutation({
    mutationFn: (values) => {
      const payload = {
        ...values,
        teacherId: values.teacherId === '' ? null : values.teacherId,
        scheduleDay: values.scheduleDay === '' ? null : values.scheduleDay,
        startTime: values.startTime === '' ? null : values.startTime,
        endTime: values.endTime === '' ? null : values.endTime,
      }
      return isEdit ? updateClass(klass.id, payload) : createClass(payload)
    },
    onSuccess,
    onError: (err) => setServerError(err.response?.data?.message ?? 'Something went wrong. Try again.'),
  })

  return (
    <Modal title={isEdit ? 'Edit class' : 'Schedule a class'} onClose={onClose} width="max-w-xl">
      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Course" htmlFor="courseId" error={errors.courseId?.message}>
            <select id="courseId" {...register('courseId')} className={inputClass}>
              <option value="">Select a course…</option>
              {courses?.data.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Section" htmlFor="sectionId" error={errors.sectionId?.message}>
            <select id="sectionId" {...register('sectionId')} className={inputClass}>
              <option value="">Select a section…</option>
              {sections?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Academic year" htmlFor="academicYearId" error={errors.academicYearId?.message}>
            <select id="academicYearId" {...register('academicYearId')} className={inputClass}>
              <option value="">Select a year…</option>
              {academicYears?.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Teacher" htmlFor="teacherId" error={errors.teacherId?.message}>
            <select id="teacherId" {...register('teacherId')} className={inputClass}>
              <option value="">Unassigned</option>
              {teachers?.data.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.first_name} {t.last_name}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <FormField label="Room" htmlFor="room" error={errors.room?.message}>
            <input id="room" {...register('room')} className={inputClass} />
          </FormField>
          <FormField label="Day" htmlFor="scheduleDay" error={errors.scheduleDay?.message}>
            <select id="scheduleDay" {...register('scheduleDay')} className={inputClass}>
              {DAYS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Start" htmlFor="startTime" error={errors.startTime?.message}>
            <input id="startTime" type="time" {...register('startTime')} className={inputClass} />
          </FormField>
          <FormField label="End" htmlFor="endTime" error={errors.endTime?.message}>
            <input id="endTime" type="time" {...register('endTime')} className={inputClass} />
          </FormField>
        </div>

        {serverError && (
          <p role="alert" className="rounded-lg bg-danger-100 px-3 py-2 text-sm text-danger-600">
            {serverError}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || mutation.isPending}>
            {isEdit ? 'Save changes' : 'Schedule class'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
