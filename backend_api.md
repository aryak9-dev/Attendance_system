# Backend API Plan

This document defines the REST API endpoints planned for the Attendance Management System backend.

The backend is built with FastAPI and the endpoints are organized according to the route files defined in `backend.md`.

## 1. Users API

**Route file:** `app/routes/users.py`

Handles students and teachers stored in the `users` table.

### Create User

```text
POST /users
```

Creates a new student or teacher.

Used later for student/teacher registration.

### Get All Users

```text
GET /users
```

Returns a list of users.

Can be used by teachers/admin functionality to view students or teachers.

### Get User

```text
GET /users/{user_id}
```

Returns information about a specific user.

### Update User

```text
PUT /users/{user_id}
```

Updates user information such as name, email, password, role, or profile photo.

---

## 2. Classes API

**Route file:** `app/routes/classes.py`

Handles classes/courses stored in the `classes` table.

### Create Class

```text
POST /classes
```

Creates a new class and assigns a teacher to it.

### Get All Classes

```text
GET /classes
```

Returns all available classes.

Used by the student dashboard to view available classes.

### Get Class

```text
GET /classes/{class_id}
```

Returns information about a specific class.

### Update Class

```text
PUT /classes/{class_id}
```

Updates class information such as name, description, teacher, or capacity.

---

## 3. Slots API

**Route file:** `app/routes/slots.py`

Handles weekly class schedules stored in the `slots` table.

### Create Slot

```text
POST /classes/{class_id}/slots
```

Creates a weekly time slot for a class.

Example:

```text
Class: Data Structures
Day: Monday
Start: 10:00
End: 11:00
```

### Get Class Slots

```text
GET /classes/{class_id}/slots
```

Returns all weekly slots belonging to a class.

### Update Slot

```text
PUT /slots/{slot_id}
```

Updates the day or timing of an existing slot.

### Delete Slot

```text
DELETE /slots/{slot_id}
```

Removes a class slot.

---

## 4. Enrollment API

**Route file:** `app/routes/enrollments.py`

Handles the relationship between students and classes using the `enrollments` table.

### Enroll Student

```text
POST /enrollments
```

Enrolls a student into a class.

The request contains the student ID and class ID.

### Get Student Enrollments

```text
GET /students/{student_id}/enrollments
```

Returns the classes in which a student is enrolled.

Used by the student dashboard.

### Get Class Students

```text
GET /classes/{class_id}/students
```

Returns the students enrolled in a class.

Used by the teacher dashboard.

### Remove Enrollment

```text
DELETE /enrollments/{enrollment_id}
```

Removes a student from a class.

---

## 5. Attendance API

**Route file:** `app/routes/attendance.py`

Handles attendance records stored in the `attendance` table.

### Mark Attendance

```text
POST /attendance
```

Creates an attendance record for a student.

The attendance record contains information such as:

- Enrollment
- Slot
- Date
- Status (`present` / `absent`)

### Get Attendance Record

```text
GET /attendance/{attendance_id}
```

Returns a specific attendance record.

### Get Student Attendance

```text
GET /students/{student_id}/attendance
```

Returns the attendance history of a student.

Used by the student dashboard.

### Get Class Attendance

```text
GET /classes/{class_id}/attendance
```

Returns attendance records for students in a class.

Used by the teacher dashboard.

---

## 6. Face Recognition API

**Service:** `app/services/face_recognition.py`

Face recognition is implemented as a service rather than a separate route file in the current backend structure.

The service handles:

- Face detection
- Face embedding generation
- Face embedding comparison
- Student identification

### Register Student Face

```text
POST /face/register
```

Receives a student's face image, generates the face embedding, and stores the embedding in `face_data`.

The profile photo and face embedding have different purposes:

```text
Profile photo
    ↓
users.profile_photo

Face embedding
    ↓
face_data
```

### Recognize Face

```text
POST /face/recognize
```

Receives an image/frame, detects the face, generates an embedding, compares it with stored embeddings, and identifies the student.

The result can contain information such as:

```text
student_id
confidence
matched
```

The exact AI implementation will be handled inside `services/face_recognition.py`.

---

# Complete API List

```text
USERS
POST   /users
GET    /users
GET    /users/{user_id}
PUT    /users/{user_id}

CLASSES
POST   /classes
GET    /classes
GET    /classes/{class_id}
PUT    /classes/{class_id}

SLOTS
POST   /classes/{class_id}/slots
GET    /classes/{class_id}/slots
PUT    /slots/{slot_id}
DELETE /slots/{slot_id}

ENROLLMENTS
POST   /enrollments
GET    /students/{student_id}/enrollments
GET    /classes/{class_id}/students
DELETE /enrollments/{enrollment_id}

ATTENDANCE
POST   /attendance
GET    /attendance/{attendance_id}
GET    /students/{student_id}/attendance
GET    /classes/{class_id}/attendance

FACE RECOGNITION
POST   /face/register
POST   /face/recognize
```

# API Development Order

We will not build all endpoints at once.

For each feature, we will develop the model, schema, route, and required business logic together and test it before moving to the next feature.

```text
1. FastAPI setup
       ↓
2. PostgreSQL connection
       ↓
3. Users
   ├── model
   ├── schemas
   ├── routes
   └── testing
       ↓
4. Classes
   ├── model
   ├── schemas
   ├── routes
   └── testing
       ↓
5. Slots
       ↓
6. Enrollments
       ↓
7. Attendance
       ↓
8. Face Recognition
       ↓
9. Frontend Integration
```

# Basic Request Flow

```text
Frontend
    ↓
HTTP Request
    ↓
FastAPI Route
    ↓
Pydantic Schema
    ↓
Business Logic / Service
    ↓
SQLAlchemy Model
    ↓
PostgreSQL
    ↓
Response Schema
    ↓
FastAPI
    ↓
JSON Response
    ↓
Frontend
```

For face recognition:

```text
Frontend
    ↓
FastAPI Route
    ↓
Face Recognition Service
    ↓
Face Detection
    ↓
Face Embedding
    ↓
Compare with face_data
    ↓
Identify Student
    ↓
Attendance Logic
    ↓
PostgreSQL
    ↓
JSON Response
    ↓
Frontend
```

# Notes

- Authentication is not part of the initial implementation and can be added later.
- Initial development uses seeded/test data.
- `schema.sql` and `seed.sql` are used only for database setup and development data.
- Normal API operations will interact with PostgreSQL through SQLAlchemy.
- Face embeddings are stored in `face_data`.
- Profile photos are stored in `users.profile_photo`.
- No attendance photos or videos are stored.
- The API structure can be extended later if additional functionality is required.