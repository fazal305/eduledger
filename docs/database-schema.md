# EduLedger — Database Schema

Source of truth: [`database/migrations/001_init.sql`](../database/migrations/001_init.sql).
MySQL 8+. All monetary columns use `DECIMAL(10,2)` — never `FLOAT`/`DOUBLE`.

## Entities

| Table | Purpose |
|---|---|
| `academic_years` | School years (e.g. "2025-2026"), one flagged `is_current`. |
| `departments` | Academic departments (Math, Science, English, ...). |
| `sections` | A grade + section within an academic year (e.g. "Grade 9 - A"). |
| `courses` | A subject taught (e.g. "Algebra I"), owned by a department. |
| `teachers` | Teacher records, optionally linked to a `departments` row. |
| `students` | Student records, each currently assigned to one `sections` row. |
| `parents` | Parent/guardian records. |
| `parent_student` | Many-to-many join: a parent can have multiple children; a student can have multiple guardians, tagged with a `relationship`. |
| `users` | Login accounts. One role each (`admin`/`staff`/`teacher`/`parent`/`student`); optionally FKs into `students`/`teachers`/`parents` to scope portal access. |
| `classes` | One `course` taught to one `section` in one `academic_year` by one `teacher`, with a schedule slot. |
| `enrollments` | Join table: a `student` enrolled in a `class`. Unique per (student, class) — prevents duplicate enrollment. |
| `attendance` | Per-class, per-student, per-date attendance status. Unique per (class, student, date). |
| `exams` | An exam tied to a `class`, with a `max_marks`. |
| `marks` | A student's obtained marks for an `exam`. Unique per (exam, student). |
| `fee_types` | Fee categories (Tuition, Transport, ...). |
| `fees` | A fee owed by a student for an academic year, with a status derived from payments. |
| `payments` | A payment recorded against a `fees` row. |

## Key relationships

```
students ─< enrollments >─ classes ─< exams ─< marks >─ students
students ─< attendance >─ classes
students ─< fees ─< payments
parents ─< parent_student >─ students
teachers ─< classes
departments ─< teachers
departments ─< courses
```

## Constraints worth noting

- `enrollments` has a unique key on `(student_id, class_id)` — the database itself rejects
  duplicate enrollment, not just the UI.
- `attendance` has a unique key on `(class_id, student_id, date)` — one attendance record
  per student per class per day.
- `marks.obtained_marks` and `exams.max_marks` are constrained (`CHECK`) to be non-negative /
  positive respectively; marks entry is validated again at the API layer in Phase 3.
- Deleting a `student`/`teacher`/`parent` cascades to their `users` row (`ON DELETE CASCADE`)
  so a removed person can't retain a dangling login.
