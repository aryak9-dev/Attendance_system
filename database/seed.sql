-- Attendance Management System
-- Development / Test Seed Data

-- ==========================================
-- TEACHERS
-- ==========================================

INSERT INTO users (name, registration_number, email, password_hash, role, profile_photo) VALUES
('Amit Sharma', 'FAC001' 'amit.sharma@college.com', NULL, 'teacher', NULL),
('Priya Singh', 'FAC002' 'priya.singh@college.com', NULL, 'teacher', NULL),
('Rahul Verma', 'FAC003' 'rahul.verma@college.com', NULL, 'teacher', NULL),
('Neha Gupta', 'FAC004' 'neha.gupta@college.com', NULL, 'teacher', NULL),
('Vikram Mehta', 'FAC005' 'vikram.mehta@college.com', NULL, 'teacher', NULL);


-- ==========================================
-- STUDENTS
-- ==========================================

INSERT INTO users
(name, email, password_hash, role, registration_number, profile_photo)
VALUES
('Aarav Kumar', 'aarav.kumar@college.com', NULL, 'student', 'STU001', NULL),
('Aditya Singh', 'aditya.singh@college.com', NULL, 'student', 'STU002', NULL),
('Ananya Sharma', 'ananya.sharma@college.com', NULL, 'student', 'STU003', NULL),
('Arjun Verma', 'arjun.verma@college.com', NULL, 'student', 'STU004', NULL),
('Diya Gupta', 'diya.gupta@college.com', NULL, 'student', 'STU005', NULL),
('Ishaan Patel', 'ishaan.patel@college.com', NULL, 'student', 'STU006', NULL),
('Kavya Mehta', 'kavya.mehta@college.com', NULL, 'student', 'STU007', NULL),
('Krish Malhotra', 'krish.malhotra@college.com', NULL, 'student', 'STU008', NULL),
('Meera Shah', 'meera.shah@college.com', NULL, 'student', 'STU009', NULL),
('Naman Joshi', 'naman.joshi@college.com', NULL, 'student', 'STU010', NULL),
('Nisha Kapoor', 'nisha.kapoor@college.com', NULL, 'student', 'STU011', NULL),
('Pranav Agarwal', 'pranav.agarwal@college.com', NULL, 'student', 'STU012', NULL),
('Riya Jain', 'riya.jain@college.com', NULL, 'student', 'STU013', NULL),
('Rohan Gupta', 'rohan.gupta@college.com', NULL, 'student', 'STU014', NULL),
('Sakshi Verma', 'sakshi.verma@college.com', NULL, 'student', 'STU015', NULL),
('Shivam Yadav', 'shivam.yadav@college.com', NULL, 'student', 'STU016', NULL),
('Simran Kaur', 'simran.kaur@college.com', NULL, 'student', 'STU017', NULL),
('Tanya Sharma', 'tanya.sharma@college.com', NULL, 'student', 'STU018', NULL),
('Varun Singh', 'varun.singh@college.com', NULL, 'student', 'STU019', NULL),
('Yash Patel', 'yash.patel@college.com', NULL, 'student', 'STU020', NULL),
('Aditi Rao', 'aditi.rao@college.com', NULL, 'student', 'STU021', NULL),
('Dev Kumar', 'dev.kumar@college.com', NULL, 'student', 'STU022', NULL),
('Harsh Mehta', 'harsh.mehta@college.com', NULL, 'student', 'STU023', NULL),
('Isha Gupta', 'isha.gupta@college.com', NULL, 'student', 'STU024', NULL),
('Karan Shah', 'karan.shah@college.com', NULL, 'student', 'STU025', NULL),
('Maya Joshi', 'maya.joshi@college.com', NULL, 'student', 'STU026', NULL),
('Nikhil Jain', 'nikhil.jain@college.com', NULL, 'student', 'STU027', NULL),
('Pooja Agarwal', 'pooja.agarwal@college.com', NULL, 'student', 'STU028', NULL),
('Sameer Kapoor', 'sameer.kapoor@college.com', NULL, 'student', 'STU029', NULL),
('Zoya Khan', 'zoya.khan@college.com', NULL, 'student', 'STU030', NULL);


-- ==========================================
-- CLASSES
-- ==========================================

INSERT INTO classes
(name, description, teacher_id, capacity)
VALUES
(
    'Data Structures',
    'Study of fundamental data structures and algorithms',
    1,
    30
),
(
    'Database Management Systems',
    'Fundamentals of relational databases and SQL',
    2,
    30
);


-- ==========================================
-- SLOTS
-- ==========================================

-- Data Structures
INSERT INTO slots
(class_id, day, start_time, end_time)
VALUES
(1, 'Monday', '10:00', '11:00'),
(1, 'Wednesday', '10:00', '11:00'),
(1, 'Friday', '10:00', '11:00');

-- Database Management Systems
INSERT INTO slots
(class_id, day, start_time, end_time)
VALUES
(2, 'Tuesday', '14:00', '15:00'),
(2, 'Thursday', '14:00', '15:00'),
(2, 'Saturday', '11:00', '12:00');


-- ==========================================
-- ENROLLMENTS
-- ==========================================

-- Students 1-20 → Data Structures
INSERT INTO enrollments (student_id, class_id)
SELECT id, 1
FROM users
WHERE role = 'student'
ORDER BY id
LIMIT 20;

-- Students 11-30 → DBMS
INSERT INTO enrollments (student_id, class_id)
SELECT id, 2
FROM users
WHERE role = 'student'
ORDER BY id
OFFSET 10
LIMIT 20;


-- ==========================================
-- ATTENDANCE
-- ==========================================

-- Data Structures - Monday
INSERT INTO attendance
(enrollment_id, slot_id, date, status)
SELECT
    e.id,
    1,
    '2026-09-07',
    CASE
        WHEN e.id % 5 = 0 THEN 'absent'
        ELSE 'present'
    END
FROM enrollments e
WHERE e.class_id = 1;


-- Data Structures - Wednesday
INSERT INTO attendance
(enrollment_id, slot_id, date, status)
SELECT
    e.id,
    2,
    '2026-09-09',
    CASE
        WHEN e.id % 4 = 0 THEN 'absent'
        ELSE 'present'
    END
FROM enrollments e
WHERE e.class_id = 1;


-- Data Structures - Friday
INSERT INTO attendance
(enrollment_id, slot_id, date, status)
SELECT
    e.id,
    3,
    '2026-09-11',
    CASE
        WHEN e.id % 6 = 0 THEN 'absent'
        ELSE 'present'
    END
FROM enrollments e
WHERE e.class_id = 1;


-- DBMS - Tuesday
INSERT INTO attendance
(enrollment_id, slot_id, date, status)
SELECT
    e.id,
    4,
    '2026-09-08',
    CASE
        WHEN e.id % 5 = 0 THEN 'absent'
        ELSE 'present'
    END
FROM enrollments e
WHERE e.class_id = 2;


-- DBMS - Thursday
INSERT INTO attendance
(enrollment_id, slot_id, date, status)
SELECT
    e.id,
    5,
    '2026-09-10',
    CASE
        WHEN e.id % 4 = 0 THEN 'absent'
        ELSE 'present'
    END
FROM enrollments e
WHERE e.class_id = 2;


-- DBMS - Saturday
INSERT INTO attendance
(enrollment_id, slot_id, date, status)
SELECT
    e.id,
    6,
    '2026-09-12',
    CASE
        WHEN e.id % 6 = 0 THEN 'absent'
        ELSE 'present'
    END
FROM enrollments e
WHERE e.class_id = 2;


-- ==========================================
-- FACE DATA
-- ==========================================

-- Face embeddings will be inserted later
-- after the face-recognition model is integrated.