# Attendance System — Frontend Development Plan

## 1. Purpose

The frontend will provide the user interface for the Attendance System and communicate with the FastAPI backend.

The frontend must NOT communicate directly with PostgreSQL.

The architecture is:

Frontend → FastAPI Backend → PostgreSQL

The frontend is responsible for:

- Displaying data
- Collecting user input
- Sending API requests
- Handling API responses
- Showing success/error messages
- Managing navigation
- Managing frontend state
- Providing student and teacher dashboards

The backend is responsible for:

- Business logic
- Database operations
- Validation
- Authentication
- Authorization
- Returning API responses

---

# 2. Current Backend Features Available

The backend currently contains:

- Users
- Classes
- Slots
- Enrollments
- Attendance

Current API groups:

```text
/users
/classes
/slots
/enrollments
/attendance
```

There is also a registration-number lookup API:

```text
GET /users/registration/{registration_number}
```

---

# 3. Frontend Technology

Recommended frontend stack:

```text
React
Vite
JavaScript
CSS
```

The frontend should communicate with FastAPI using HTTP requests.

A centralized API service should be used instead of writing API calls independently inside every component.

Suggested structure:

```text
frontend/
│
├── src/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ClassCard.jsx
│   │   ├── SlotCard.jsx
│   │   ├── StudentCard.jsx
│   │   └── AttendanceTable.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── TeacherDashboard.jsx
│   │   ├── Classes.jsx
│   │   ├── MyClasses.jsx
│   │   ├── Students.jsx
│   │   └── Attendance.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
└── package.json
```

---

# 4. Frontend Pages

## 4.1 Login Page

The login page should allow a user to enter:

- Registration number
- Password

Example:

```text
Registration Number
[ STU001 ]

Password
[ ******** ]

[ Login ]
```

For teachers:

```text
FAC001
```

For students:

```text
STU001
```

The final login API will be connected once authentication is implemented.

---

# 5. Registration Page

The registration page will allow a student/user to provide:

- Name
- Registration number
- Email
- Password
- Role

Example:

```text
Name
[ Aarav Kumar ]

Registration Number
[ STU001 ]

Email
[ aarav@gmail.com ]

Password
[ ******** ]

Role
[ Student ]

[ Register ]
```

Important:

The registration number must be unique.

The frontend should display a clear error if the backend returns a conflict.

Example:

```text
Registration number already exists.
Please enter your assigned registration number.
```

The frontend must NOT assume that a registration number is unique just because it checked it locally.

The backend/database is the final authority.

---

# 6. Student Dashboard

The student dashboard should show:

```text
Student Dashboard

Welcome, Aarav Kumar
Registration Number: STU001

My Classes
Attendance
Available Classes
Upcoming Slots
```

Possible dashboard cards:

```text
+----------------+  +----------------+
| My Classes     |  | Attendance     |
|      3         |  |      87%       |
+----------------+  +----------------+

+----------------+
| Upcoming Slots |
|      2         |
+----------------+
```

---

# 7. Available Classes

The student should be able to see available classes.

Example:

```text
Python Programming

Teacher: Amit Sharma

Monday
10:00 AM - 11:00 AM

Capacity: 25 / 30

[ Register ]
```

The frontend gets class information from:

```http
GET /classes
```

Slot information:

```http
GET /slots
```

The frontend can combine class and slot information for display.

---

# 8. Class Registration

When a student clicks:

```text
[ Register ]
```

the frontend sends:

```http
POST /enrollments
```

Example request:

```json
{
  "student_id": 1,
  "class_id": 2
}
```

The backend checks:

- Student exists
- User is actually a student
- Class exists
- Class has available capacity
- Student is not already enrolled

Success:

```text
201 Created
```

Frontend should display:

```text
Successfully registered for the class.
```

Duplicate registration:

```text
409 Conflict
```

Frontend should display:

```text
You are already registered for this class.
```

Class full:

```text
400 Bad Request
```

Frontend should display:

```text
This class is currently full.
```

---

# 9. My Classes

The student should be able to see classes they have registered for.

Example:

```text
My Classes

Python Programming
Teacher: Amit Sharma
Monday
10:00 AM - 11:00 AM

Status: Registered
```

The frontend will use enrollment information and class information to construct this page.

---

# 10. Student Attendance

The student should be able to see attendance records.

Example:

```text
My Attendance

Python Programming       92%
Data Structures          85%
Database Systems         78%
```

Detailed view:

```text
Date          Slot          Status

13-09-2026    10:00 AM      Present
15-09-2026    10:00 AM      Present
17-09-2026    10:00 AM      Absent
```

Current backend attendance endpoint:

```http
GET /attendance
```

A student-specific attendance endpoint should eventually be added so the frontend does not have to download every student's attendance.

Preferred future API:

```http
GET /students/me/attendance
```

or another authenticated equivalent.

---

# 11. Teacher Dashboard

Teacher dashboard should show:

```text
Teacher Dashboard

Welcome, Amit Sharma
Registration Number: FAC001

My Classes
Total Students
Attendance
```

Example:

```text
My Classes

Python Programming
Monday 10:00 - 11:00
Students: 25 / 30

[ View Students ]
[ Attendance ]
```

---

# 12. Teacher Classes

Teachers should only see classes associated with them.

Example:

```text
My Classes

--------------------------------
Python Programming

Monday
10:00 - 11:00

Students: 25 / 30

[ View Students ]
[ View Attendance ]
--------------------------------
```

A teacher should not be able to manipulate another teacher's class simply by changing an ID in the frontend.

Authorization must eventually be enforced by the backend.

---

# 13. Teacher → Students

The teacher should be able to view students enrolled in a class.

Example:

```text
Python Programming

Students

Registration No.    Name

STU001              Aarav Kumar
STU002              Aditya Singh
STU003              Ananya Sharma
STU004              Arjun Verma
```

The frontend can provide a search box:

```text
Search student
[ STU001             ] [ Search ]
```

The registration-number search API is:

```http
GET /users/registration/{registration_number}
```

Example:

```http
GET /users/registration/STU001
```

Response:

```json
{
  "id": 1,
  "name": "Aarav Kumar",
  "registration_number": "STU001",
  "email": "aarav.kumar@college.com",
  "role": "student",
  "created_at": "..."
}
```

The frontend should then display the returned information.

---

# 14. Teacher Attendance Page

Teacher should be able to see attendance for a class and slot.

Example:

```text
Python Programming
Monday 10:00 - 11:00

Date:
[ 13-09-2026 ]

Student             Registration     Status

Aarav Kumar         STU001           Present
Aditya Singh        STU002           Present
Ananya Sharma       STU003           Absent

[ Save Attendance ]
```

Current attendance creation API:

```http
POST /attendance
```

Example:

```json
{
  "enrollment_id": 1,
  "slot_id": 2,
  "date": "2026-09-13",
  "status": "present"
}
```

---

# 15. Attendance Status

The backend currently supports:

```text
present
absent
```

The frontend should use these exact values when communicating with the backend.

Do not send:

```text
Present
Absent
P
A
```

unless the backend API is explicitly changed to accept those values.

---

# 16. Registration Number Search

Registration number is the user-facing identifier.

Examples:

```text
STU001
STU002

FAC001
FAC002
```

The frontend can use:

```http
GET /users/registration/{registration_number}
```

when it needs to search for a particular user.

Example:

```text
User enters:

STU001

        ↓

GET /users/registration/STU001

        ↓

Backend

        ↓

PostgreSQL

        ↓

UserResponse

        ↓

Frontend
```

The frontend should not access the database directly.

---

# 17. API Service Layer

All API communication should preferably be centralized.

Example:

```text
src/services/api.js
```

Possible functions:

```javascript
getUsers()
getUserById(id)
getUserByRegistrationNumber(registrationNumber)

createUser(data)
updateUser(id, data)

getClasses()
getClassById(id)
createClass(data)
updateClass(id, data)

getSlots()
getSlotById(id)
createSlot(data)
updateSlot(id, data)

getEnrollments()
getEnrollmentById(id)
createEnrollment(data)
updateEnrollment(id, data)

getAttendance()
getAttendanceById(id)
createAttendance(data)
updateAttendance(id, data)
```

Pages should call these functions rather than repeatedly writing raw HTTP requests.

---

# 18. API Request Rules

Before sending a request, frontend should make sure the request body follows the backend schema.

Example:

```http
POST /classes
```

Request:

```json
{
  "name": "Python Programming",
  "description": "Python programming fundamentals",
  "teacher_id": 31,
  "capacity": 30
}
```

Do not send unnecessary fields.

For example, don't send:

```json
{
  "id": 10,
  "created_at": "...",
  "name": "Python Programming",
  "teacher_id": 31,
  "capacity": 30
}
```

when creating a class.

---

# 19. API Response Handling

The frontend should handle at least:

```text
2xx → success
4xx → client/business error
5xx → server error
```

Common responses:

```text
201 Created
200 OK
400 Bad Request
404 Not Found
409 Conflict
500 Internal Server Error
```

Example:

```javascript
try {
    const response = await createEnrollment(data);

    // success
} catch (error) {
    // display useful error
}
```

---

# 20. Error Messages

Do not display raw technical errors whenever possible.

Backend:

```text
409 Conflict
A user with this email or registration number already exists.
```

Frontend:

```text
Registration number or email already exists.
```

Backend:

```text
404 User not found.
```

Frontend:

```text
No user found with this registration number.
```

Backend:

```text
400 Class capacity is full.
```

Frontend:

```text
This class is full.
```

---

# 21. Loading States

Every API request can take time.

The frontend should show a loading state.

Example:

```text
Loading classes...
```

or:

```text
[ Loading... ]
```

Buttons should preferably be disabled while an important request is being submitted.

Example:

```text
Registering...
```

instead of allowing the user to click Register multiple times.

---

# 22. Empty States

The frontend should handle empty API responses.

Example:

```text
No classes are currently available.
```

instead of showing a blank screen.

Student with no enrollments:

```text
You have not registered for any classes yet.
```

Teacher with no classes:

```text
No classes assigned.
```

---

# 23. ID vs Registration Number

The frontend should understand the difference.

Database:

```text
id = internal database identifier
```

User-facing:

```text
registration_number = STU001 / FAC001
```

The frontend should display the registration number to users.

Example:

```text
Registration Number: STU001
```

The database `id` should generally remain an internal implementation detail.

However, some current APIs use IDs in request paths/bodies.

For example:

```http
GET /users/{user_id}
PUT /users/{user_id}

POST /enrollments
```

The frontend must follow the actual backend API contract.

---

# 24. Frontend State

The frontend needs to maintain information such as:

```text
Current user
User role
Classes
Slots
Enrollments
Attendance
Loading state
Error state
```

After authentication is implemented, the authenticated user's information should be available throughout the application.

The frontend should use role-based navigation:

```text
student
   ↓
Student Dashboard

teacher
   ↓
Teacher Dashboard
```

A student should not simply be able to access teacher functionality by changing the URL.

The backend must also enforce authorization.

---

# 25. Forms

Forms should validate obvious problems before sending requests.

Examples:

```text
Name cannot be empty
Email should have valid format
Password cannot be empty
Registration number cannot be empty
Capacity must be greater than 0
End time must be after start time
```

However:

Frontend validation is for user experience.

Backend validation is authoritative.

Never rely only on frontend validation.

---

# 26. Class and Slot Display

The backend separates:

```text
Class
Slot
```

A class can have multiple slots.

Example:

```text
Python Programming
       │
       ├── Monday 10:00 - 11:00
       ├── Wednesday 10:00 - 11:00
       └── Friday 10:00 - 11:00
```

The frontend should therefore not assume:

```text
one class = one slot
```

---

# 27. Future Face Recognition UI

Face recognition will be added later.

The eventual flow will be:

```text
Teacher selects class
        ↓
Selects slot
        ↓
Opens camera
        ↓
Face detected
        ↓
Recognition service
        ↓
Student identified
        ↓
Attendance marked
```

The existing attendance page should be designed so that face recognition can later be integrated without completely redesigning the page.

---

# 28. Future Authentication

Authentication is not fully implemented yet.

Eventually:

```text
Registration
      ↓
Login
      ↓
Authentication
      ↓
Token/session
      ↓
Dashboard
```

The frontend should not implement authentication rules itself.

The backend will verify:

- Credentials
- User identity
- Role
- Authorization

---

# 29. CORS

Because frontend and backend may run on different ports during development:

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:8000
```

FastAPI must allow the frontend origin through CORS.

This must be configured in the backend.

---

# 30. Environment Variables

The frontend should not hard-code the backend URL everywhere.

Use an environment variable.

Example:

```text
VITE_API_URL=http://localhost:8000
```

Then API service code can use:

```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

This makes it easier to change between:

```text
Local development
Testing
Production
```

---

# 31. Important API Integration Rule

Always check the backend schema before creating the frontend request.

For every API document:

```text
METHOD
ENDPOINT
REQUEST BODY
RESPONSE BODY
SUCCESS STATUS
ERROR STATUS
```

Example:

```text
POST /enrollments

Request:
{
    "student_id": 1,
    "class_id": 2
}

Success:
201

Response:
{
    "id": 10,
    "student_id": 1,
    "class_id": 2,
    "enrolled_at": "..."
}

Possible errors:
400
409
```

The frontend should be developed against this contract.

---

# 32. Do Not Use Mock Data Once API Is Ready

During initial UI development, mock data can be used temporarily.

Example:

```javascript
const classes = [
    {
        name: "Python Programming"
    }
];
```

But once the corresponding backend API is ready, replace mock data with real API calls.

Final flow must be:

```text
React
  ↓
API service
  ↓
FastAPI
  ↓
PostgreSQL
```

not:

```text
React
  ↓
Hard-coded data
```

---

# 33. Development Order

Frontend should be developed in this order:

## Phase 1 — Basic setup

```text
React + Vite
Routing
Global layout
Navbar
Sidebar
API service
CSS
```

## Phase 2 — User interface

```text
Login
Registration
Student Dashboard
Teacher Dashboard
```

## Phase 3 — Student functionality

```text
Available Classes
View Slots
Register for Class
My Classes
Attendance
```

## Phase 4 — Teacher functionality

```text
My Classes
View Students
View Slots
Attendance
```

## Phase 5 — API integration

Connect the pages to:

```text
/users
/classes
/slots
/enrollments
/attendance
```

and:

```text
/users/registration/{registration_number}
```

## Phase 6 — Authentication

```text
Login
Token/session
Protected routes
Role-based access
Logout
```

## Phase 7 — Face recognition

```text
Camera
Face registration
Embedding
Recognition
Automatic attendance
```

---

# 34. 50% Project Demonstration Target

The first major frontend milestone should be:

```text
             ATTENDANCE SYSTEM
                     │
          ┌──────────┴──────────┐
          │                     │
       STUDENT                TEACHER
          │                     │
       Login                  Login
          │                     │
      Dashboard             Dashboard
          │                     │
   Available Classes        My Classes
          │                     │
      Register              Students
          │                     │
     My Classes            Attendance
          │                     │
      Attendance              │
          │                     │
          └──────────┬──────────┘
                     │
                  FastAPI
                     │
                PostgreSQL
```

This milestone should demonstrate a real:

```text
Frontend
    ↓
API request
    ↓
FastAPI
    ↓
Database
    ↓
API response
    ↓
Frontend update
```

For example:

```text
Student clicks Register
        ↓
POST /enrollments
        ↓
FastAPI validates
        ↓
PostgreSQL stores enrollment
        ↓
201 Created
        ↓
Frontend displays
"Successfully registered"
```

---

# 35. Main Principles

Always follow these rules:

1. Frontend never directly accesses PostgreSQL.
2. Frontend communicates through backend APIs.
3. Backend is the authority for validation.
4. Frontend should follow the backend request/response schema exactly.
5. Registration number is the user-facing identifier.
6. Database IDs are primarily internal identifiers.
7. API calls should be centralized in `services/api.js`.
8. Handle loading, success, error, and empty states.
9. Do not expose passwords or password hashes.
10. Do not rely only on frontend authorization.
11. Do not hard-code API URLs.
12. Keep UI components reusable.
13. Keep API logic separate from UI components.
14. Avoid mock data once the real API is available.
15. Design the attendance UI so face recognition can be integrated later.

---

# 36. Overall Architecture

```text
                         FRONTEND
                            │
             ┌──────────────┴──────────────┐
             │                             │
         Student UI                    Teacher UI
             │                             │
             └──────────────┬──────────────┘
                            │
                       API SERVICE
                            │
                            ↓
                         FastAPI
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
      Users              Classes             Slots
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                     Enrollments
                            │
                       Attendance
                            │
                            ↓
                       PostgreSQL

                    FUTURE:
                       │
                Face Recognition
                       │
                       ↓
                  Auto Attendance
```

This document should be treated as the frontend development reference and should remain aligned with the backend API contracts as the project evolves.