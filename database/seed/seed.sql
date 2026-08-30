-- EduLedger DEMO seed data.
-- Everything here is fictional and clearly labeled as demo/seed data (see project spec Section 35):
-- student numbers are prefixed DEMO-STU-, all emails use the non-routable eduledger.test domain.
-- All demo user accounts share the password: Demo@12345

INSERT INTO academic_years (name, start_date, end_date, is_current) VALUES
  ('2025-2026', '2025-08-01', '2026-06-30', TRUE);

INSERT INTO departments (name, code) VALUES
  ('Mathematics', 'MATH'),
  ('Science', 'SCI'),
  ('English', 'ENG');

INSERT INTO sections (name, grade_level, academic_year_id, capacity) VALUES
  ('Grade 9 - A', 'Grade 9', 1, 30),
  ('Grade 9 - B', 'Grade 9', 1, 30);

INSERT INTO courses (name, code, department_id, credit_hours, description) VALUES
  ('Algebra I', 'MATH101', 1, 4, 'Introductory algebra for Grade 9 students.'),
  ('Biology', 'SCI101', 2, 4, 'Introductory life sciences for Grade 9 students.'),
  ('English Literature', 'ENG101', 3, 3, 'Reading and composition for Grade 9 students.');

INSERT INTO teachers (first_name, last_name, email, phone, department_id, hire_date, is_active) VALUES
  ('Amina', 'Yousuf', 'demo.teacher.amina@eduledger.test', '+92-300-0000001', 1, '2022-08-01', TRUE),
  ('Bilal', 'Farooq', 'demo.teacher.bilal@eduledger.test', '+92-300-0000002', 2, '2021-08-01', TRUE);

INSERT INTO classes (course_id, section_id, academic_year_id, teacher_id, room, schedule_day, start_time, end_time) VALUES
  (1, 1, 1, 1, 'Room 101', 'mon', '08:00:00', '08:45:00'),
  (2, 1, 1, 2, 'Room 202', 'tue', '09:00:00', '09:45:00'),
  (3, 1, 1, 1, 'Room 101', 'wed', '10:00:00', '10:45:00');

INSERT INTO students (student_number, first_name, last_name, date_of_birth, gender, admission_date, section_id, is_active) VALUES
  ('DEMO-STU-0001', 'Ayesha', 'Raza', '2011-03-14', 'female', '2025-08-01', 1, TRUE),
  ('DEMO-STU-0002', 'Hamza', 'Iqbal', '2011-07-22', 'male', '2025-08-01', 1, TRUE);

INSERT INTO parents (first_name, last_name, email, phone) VALUES
  ('Sana', 'Raza', 'demo.parent.sana@eduledger.test', '+92-300-0000010');

INSERT INTO parent_student (parent_id, student_id, relationship) VALUES
  (1, 1, 'mother');

INSERT INTO enrollments (student_id, class_id, enrolled_at, status) VALUES
  (1, 1, '2025-08-05', 'active'),
  (1, 2, '2025-08-05', 'active'),
  (2, 1, '2025-08-05', 'active');

INSERT INTO attendance (class_id, student_id, date, status) VALUES
  (1, 1, '2025-08-11', 'present'),
  (1, 2, '2025-08-11', 'absent');

INSERT INTO exams (class_id, name, exam_date, max_marks) VALUES
  (1, 'Algebra I - Midterm', '2025-10-15', 100);

INSERT INTO marks (exam_id, student_id, obtained_marks, grade) VALUES
  (1, 1, 88.5, 'A'),
  (1, 2, 71.0, 'B');

INSERT INTO fee_types (name, description) VALUES
  ('Tuition Fee', 'Standard per-term tuition'),
  ('Transport Fee', 'School transport service');

INSERT INTO fees (student_id, fee_type_id, academic_year_id, amount, due_date, status) VALUES
  (1, 1, 1, 45000.00, '2025-09-01', 'partially_paid'),
  (2, 1, 1, 45000.00, '2025-09-01', 'pending');

INSERT INTO payments (fee_id, amount, payment_date, method, reference, recorded_by) VALUES
  (1, 20000.00, '2025-08-20', 'bank_transfer', 'DEMO-REF-0001', NULL);

-- Demo login accounts. Password for all: Demo@12345
INSERT INTO users (name, email, password_hash, role, student_id, teacher_id, parent_id) VALUES
  ('Demo Admin', 'admin@eduledger.test', '$2b$12$oSGIB1S84cl9N/s9V4o2seJ0ZIdd856wpmIccxXNpHMoCEZgG76FO', 'admin', NULL, NULL, NULL),
  ('Demo Staff', 'staff@eduledger.test', '$2b$12$oSGIB1S84cl9N/s9V4o2seJ0ZIdd856wpmIccxXNpHMoCEZgG76FO', 'staff', NULL, NULL, NULL),
  ('Amina Yousuf', 'teacher@eduledger.test', '$2b$12$oSGIB1S84cl9N/s9V4o2seJ0ZIdd856wpmIccxXNpHMoCEZgG76FO', 'teacher', NULL, 1, NULL),
  ('Sana Raza', 'parent@eduledger.test', '$2b$12$oSGIB1S84cl9N/s9V4o2seJ0ZIdd856wpmIccxXNpHMoCEZgG76FO', 'parent', NULL, NULL, 1),
  ('Ayesha Raza', 'student@eduledger.test', '$2b$12$oSGIB1S84cl9N/s9V4o2seJ0ZIdd856wpmIccxXNpHMoCEZgG76FO', 'student', 1, NULL, NULL);
