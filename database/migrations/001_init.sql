-- EduLedger initial schema
-- MySQL 8+. Money columns use DECIMAL(10,2) (exact fixed-point), never FLOAT/DOUBLE.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------------
-- Reference / structural tables
-- ---------------------------------------------------------------------------

CREATE TABLE academic_years (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(20)  NOT NULL,          -- e.g. "2025-2026"
  start_date    DATE         NOT NULL,
  end_date      DATE         NOT NULL,
  is_current    BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_academic_years_name (name),
  CHECK (end_date > start_date)
) ENGINE=InnoDB;

CREATE TABLE departments (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  code          VARCHAR(20)  NOT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_departments_code (code)
) ENGINE=InnoDB;

CREATE TABLE sections (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name              VARCHAR(50)  NOT NULL,      -- e.g. "Grade 9 - A"
  grade_level       VARCHAR(20)  NOT NULL,      -- e.g. "Grade 9"
  academic_year_id  INT UNSIGNED NOT NULL,
  capacity          SMALLINT UNSIGNED NOT NULL DEFAULT 30,
  created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_sections_name_year (name, academic_year_id),
  CONSTRAINT fk_sections_academic_year FOREIGN KEY (academic_year_id) REFERENCES academic_years (id)
) ENGINE=InnoDB;

CREATE TABLE courses (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(150) NOT NULL,
  code            VARCHAR(20)  NOT NULL,
  department_id   INT UNSIGNED NOT NULL,
  credit_hours    TINYINT UNSIGNED NOT NULL DEFAULT 1,
  description     TEXT,
  is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_courses_code (code),
  CONSTRAINT fk_courses_department FOREIGN KEY (department_id) REFERENCES departments (id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- People
-- ---------------------------------------------------------------------------

CREATE TABLE teachers (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name     VARCHAR(80)  NOT NULL,
  last_name      VARCHAR(80)  NOT NULL,
  email          VARCHAR(150) NOT NULL,
  phone          VARCHAR(30),
  department_id  INT UNSIGNED,
  hire_date      DATE,
  is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_teachers_email (email),
  CONSTRAINT fk_teachers_department FOREIGN KEY (department_id) REFERENCES departments (id)
) ENGINE=InnoDB;

CREATE TABLE students (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_number   VARCHAR(20)  NOT NULL,
  first_name       VARCHAR(80)  NOT NULL,
  last_name        VARCHAR(80)  NOT NULL,
  date_of_birth    DATE         NOT NULL,
  gender           ENUM('female', 'male', 'other') NOT NULL,
  admission_date   DATE         NOT NULL,
  section_id       INT UNSIGNED,
  is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_students_student_number (student_number),
  CONSTRAINT fk_students_section FOREIGN KEY (section_id) REFERENCES sections (id) ON DELETE SET NULL,
  INDEX idx_students_name (last_name, first_name)
) ENGINE=InnoDB;

CREATE TABLE parents (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  first_name  VARCHAR(80)  NOT NULL,
  last_name   VARCHAR(80)  NOT NULL,
  email       VARCHAR(150) NOT NULL,
  phone       VARCHAR(30),
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_parents_email (email)
) ENGINE=InnoDB;

-- Many-to-many: a parent may have multiple children; a student may have multiple guardians.
CREATE TABLE parent_student (
  parent_id     INT UNSIGNED NOT NULL,
  student_id    INT UNSIGNED NOT NULL,
  relationship  ENUM('mother', 'father', 'guardian') NOT NULL,
  PRIMARY KEY (parent_id, student_id),
  CONSTRAINT fk_parent_student_parent FOREIGN KEY (parent_id) REFERENCES parents (id) ON DELETE CASCADE,
  CONSTRAINT fk_parent_student_student FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE users (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(150) NOT NULL,
  email          VARCHAR(150) NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  role           ENUM('admin', 'staff', 'teacher', 'parent', 'student') NOT NULL,
  is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
  student_id     INT UNSIGNED,
  teacher_id     INT UNSIGNED,
  parent_id      INT UNSIGNED,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email),
  CONSTRAINT fk_users_student FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
  CONSTRAINT fk_users_teacher FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON DELETE CASCADE,
  CONSTRAINT fk_users_parent FOREIGN KEY (parent_id) REFERENCES parents (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Classes & enrollment
-- ---------------------------------------------------------------------------

-- A "class" is one course taught to one section, in one academic year, by one teacher.
CREATE TABLE classes (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_id         INT UNSIGNED NOT NULL,
  section_id        INT UNSIGNED NOT NULL,
  academic_year_id  INT UNSIGNED NOT NULL,
  teacher_id        INT UNSIGNED,
  room              VARCHAR(30),
  schedule_day      ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'),
  start_time        TIME,
  end_time          TIME,
  is_active         BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_classes_course_section_year (course_id, section_id, academic_year_id),
  CONSTRAINT fk_classes_course FOREIGN KEY (course_id) REFERENCES courses (id),
  CONSTRAINT fk_classes_section FOREIGN KEY (section_id) REFERENCES sections (id),
  CONSTRAINT fk_classes_academic_year FOREIGN KEY (academic_year_id) REFERENCES academic_years (id),
  CONSTRAINT fk_classes_teacher FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE enrollments (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id        INT UNSIGNED NOT NULL,
  class_id          INT UNSIGNED NOT NULL,
  enrolled_at       DATE         NOT NULL,
  status            ENUM('active', 'dropped', 'completed') NOT NULL DEFAULT 'active',
  created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_enrollments_student_class (student_id, class_id),
  CONSTRAINT fk_enrollments_student FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
  CONSTRAINT fk_enrollments_class FOREIGN KEY (class_id) REFERENCES classes (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Attendance
-- ---------------------------------------------------------------------------

CREATE TABLE attendance (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  class_id      INT UNSIGNED NOT NULL,
  student_id    INT UNSIGNED NOT NULL,
  date          DATE         NOT NULL,
  status        ENUM('present', 'absent', 'late', 'excused') NOT NULL,
  recorded_by   INT UNSIGNED,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_attendance_class_student_date (class_id, student_id, date),
  CONSTRAINT fk_attendance_class FOREIGN KEY (class_id) REFERENCES classes (id) ON DELETE CASCADE,
  CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
  CONSTRAINT fk_attendance_recorded_by FOREIGN KEY (recorded_by) REFERENCES users (id) ON DELETE SET NULL,
  INDEX idx_attendance_date (date)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Exams & marks
-- ---------------------------------------------------------------------------

CREATE TABLE exams (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  class_id      INT UNSIGNED NOT NULL,
  name          VARCHAR(150) NOT NULL,
  exam_date     DATE         NOT NULL,
  max_marks     SMALLINT UNSIGNED NOT NULL,
  created_by    INT UNSIGNED,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_exams_class FOREIGN KEY (class_id) REFERENCES classes (id) ON DELETE CASCADE,
  CONSTRAINT fk_exams_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL,
  CHECK (max_marks > 0)
) ENGINE=InnoDB;

CREATE TABLE marks (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  exam_id         INT UNSIGNED NOT NULL,
  student_id      INT UNSIGNED NOT NULL,
  obtained_marks  DECIMAL(6,2) NOT NULL,
  grade           VARCHAR(5),
  remarks         VARCHAR(255),
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_marks_exam_student (exam_id, student_id),
  CONSTRAINT fk_marks_exam FOREIGN KEY (exam_id) REFERENCES exams (id) ON DELETE CASCADE,
  CONSTRAINT fk_marks_student FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
  CHECK (obtained_marks >= 0)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Fees & payments
-- ---------------------------------------------------------------------------

CREATE TABLE fee_types (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  UNIQUE KEY uq_fee_types_name (name)
) ENGINE=InnoDB;

CREATE TABLE fees (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id        INT UNSIGNED NOT NULL,
  fee_type_id       INT UNSIGNED NOT NULL,
  academic_year_id  INT UNSIGNED NOT NULL,
  amount            DECIMAL(10,2) NOT NULL,
  due_date          DATE          NOT NULL,
  status            ENUM('pending', 'partially_paid', 'paid', 'overdue') NOT NULL DEFAULT 'pending',
  created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_fees_student FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
  CONSTRAINT fk_fees_fee_type FOREIGN KEY (fee_type_id) REFERENCES fee_types (id),
  CONSTRAINT fk_fees_academic_year FOREIGN KEY (academic_year_id) REFERENCES academic_years (id),
  CHECK (amount > 0),
  INDEX idx_fees_student_status (student_id, status)
) ENGINE=InnoDB;

CREATE TABLE payments (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  fee_id        INT UNSIGNED NOT NULL,
  amount        DECIMAL(10,2) NOT NULL,
  payment_date  DATE          NOT NULL,
  method        ENUM('cash', 'bank_transfer', 'card', 'other') NOT NULL,
  reference     VARCHAR(100),
  recorded_by   INT UNSIGNED,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_fee FOREIGN KEY (fee_id) REFERENCES fees (id) ON DELETE CASCADE,
  CONSTRAINT fk_payments_recorded_by FOREIGN KEY (recorded_by) REFERENCES users (id) ON DELETE SET NULL,
  CHECK (amount > 0)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
