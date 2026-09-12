-- Attendance Management System
-- PostgreSQL Database Schema

CREATE TYPE user_role AS ENUM ('student', 'teacher');
CREATE TYPE attendance_status AS ENUM ('present', 'absent');
CREATE TYPE week_day AS ENUM (
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    registration_number VARCHAR(50) UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    password_hash VARCHAR(255),
    role user_role NOT NULL,
    profile_photo BYTEA,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    teacher_id INT NOT NULL,
    capacity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (teacher_id)
        REFERENCES users(id)
);

CREATE TABLE slots (
    id SERIAL PRIMARY KEY,
    class_id INT NOT NULL,
    day week_day NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    FOREIGN KEY (class_id)
        REFERENCES classes(id)
        ON DELETE CASCADE,

    CHECK (end_time > start_time)
);

CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (class_id)
        REFERENCES classes(id)
        ON DELETE CASCADE,

    UNIQUE (student_id, class_id)
);

CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    enrollment_id INT NOT NULL,
    slot_id INT NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(10) NOT NULL CHECK (status IN ('present', 'absent')),
    FOREIGN KEY (enrollment_id)
        REFERENCES enrollments(id)
        ON DELETE CASCADE,

    FOREIGN KEY (slot_id)
        REFERENCES slots(id)
        ON DELETE CASCADE,

    UNIQUE (enrollment_id, slot_id, date)
);

CREATE TABLE face_data (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL UNIQUE,
    embedding JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);