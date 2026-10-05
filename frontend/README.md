# AttendAI — Frontend

> Automated Classroom Attendance Using Face Verification
> React · Vite · Tailwind CSS · WebRTC

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Environment Variables](#environment-variables)
5. [Project Structure](#project-structure)
6. [Routes](#routes)
7. [Authentication](#authentication)
8. [Camera & Face Recognition](#camera--face-recognition)
9. [Backend Integration](#backend-integration)
10. [Test Accounts (Seeded Data)](#test-accounts-seeded-data)
11. [Running Backend Alongside](#running-backend-alongside)
12. [Known Limitations](#known-limitations)

---

## Project Overview

AttendAI is a university capstone project that automates classroom attendance using AI-powered face verification.

**Teacher Flow:**
1. Log in → Select class & slot → Start attendance session
2. Camera opens → Backend detects & recognises student faces
3. Students are verified across multiple frames
4. Teacher reviews the attendance list → Confirms/adjusts → Submits

**Student Flow:**
1. Log in → Enroll in classes → View attendance history & percentage
2. Register face (one-time) for recognition

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 3 |
| Routing | React Router 7 |
| Camera | WebRTC `MediaDevices.getUserMedia` |
| HTTP | Fetch API (custom `ApiClient`) |
| Icons | Lucide React |
| Language | JavaScript (ES2022+) |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A modern browser with camera support (Chrome / Edge / Firefox)

### Installation

```bash
# From repository root
cd frontend

# Install dependencies
npm install

# Copy env file and set your backend URL
cp .env.example .env
```

Edit `.env` and set `VITE_API_URL` to your running FastAPI backend (see below).

### Development Server

```bash
npm run dev
```

Opens at **http://localhost:5173** (Vite may pick the next available port if 5173 is occupied).

### Production Build

```bash
npm run build
# Output goes to frontend/dist/
npm run preview  # preview the production build locally
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Base URL of the FastAPI backend |

> **Note:** Never commit `.env` to version control. `.env.example` is the template.

---

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AttendanceBadge.jsx
│   │   ├── AttendanceCounter.jsx
│   │   ├── AttendanceTable.jsx
│   │   ├── CameraFeed.jsx
│   │   ├── ClassCard.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ErrorState.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Modal.jsx
│   │   ├── MobileNav.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── RecognitionCard.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SkeletonCard.jsx
│   │   ├── SlotCard.jsx
│   │   ├── StatCard.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── StudentCard.jsx
│   │   └── VerificationStatus.jsx
│   ├── context/
│   │   └── AuthContext.jsx  # Auth state (localStorage)
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCamera.js            # WebRTC camera hook
│   │   └── useAttendanceSession.js # Multi-frame verification logic
│   ├── layouts/
│   │   ├── TeacherLayout.jsx
│   │   └── StudentLayout.jsx
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── teacher/
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── TeacherClasses.jsx
│   │   │   ├── TeacherClassDetails.jsx
│   │   │   ├── TeacherStudents.jsx
│   │   │   ├── StartAttendance.jsx
│   │   │   ├── AttendanceSession.jsx
│   │   │   ├── AttendanceReview.jsx
│   │   │   ├── AttendanceHistory.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── TeacherProfile.jsx
│   │   └── student/
│   │       ├── StudentDashboard.jsx
│   │       ├── AvailableClasses.jsx
│   │       ├── MyClasses.jsx
│   │       ├── StudentClassDetails.jsx
│   │       ├── MyAttendance.jsx
│   │       └── StudentProfile.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── services/            # API layer (matches backend contracts exactly)
│   │   ├── api.js           # Base ApiClient
│   │   ├── authApi.js
│   │   ├── userApi.js
│   │   ├── classApi.js
│   │   ├── slotApi.js
│   │   ├── enrollmentApi.js
│   │   ├── attendanceApi.js
│   │   └── faceApi.js
│   ├── utils/
│   │   ├── attendanceUtils.js
│   │   ├── errorHandler.js
│   │   ├── formatDate.js
│   │   └── formatTime.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .env
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## Routes

### Public
| Path | Page |
|------|------|
| `/` | Landing page |
| `/login` | Login (teacher or student) |
| `/register` | Student registration |

### Teacher (requires role = `teacher`)
| Path | Page |
|------|------|
| `/teacher/dashboard` | Overview stats, today's classes |
| `/teacher/classes` | All assigned classes, create class |
| `/teacher/classes/:classId` | Class details, slots, enrolled students |
| `/teacher/students` | Student lookup by registration number |
| `/teacher/attendance/start` | Select class → slot → date |
| `/teacher/attendance/session` | Live camera session, face recognition |
| `/teacher/attendance/review` | Review & confirm attendance |
| `/teacher/attendance/history` | Attendance history, CSV export |
| `/teacher/reports` | Course compliance reports |
| `/teacher/profile` | Teacher profile |

### Student (requires role = `student`)
| Path | Page |
|------|------|
| `/student/dashboard` | Overview, enrolled courses, attendance % |
| `/student/classes/available` | Browse & enroll in classes |
| `/student/classes` | My enrolled classes |
| `/student/classes/:classId` | Class details, attendance for this class |
| `/student/attendance` | Full attendance history |
| `/student/profile` | Profile, face registration |

> Protected routes redirect unauthenticated users to `/login`.
> Role-mismatch redirects send teachers to `/teacher/dashboard` and students to `/student/dashboard`.

---

## Authentication

The backend currently does **not** implement JWT tokens. The frontend uses a temporary strategy:

1. `GET /users/registration/{registration_number}` — look up user by registration number
2. Verify password client-side (stored in plain text in current backend)
3. Store user object in `localStorage` under key `attendance_auth_user`
4. All protected routes read from this stored value

> **When the backend adds JWT:** Replace the `login()` function in `src/services/authApi.js` with a `POST /auth/login` call and store the token. The rest of the app is already structured to support this.

---

## Camera & Face Recognition

### Camera Access
The `useCamera` hook wraps `navigator.mediaDevices.getUserMedia`:
- Requests `{ video: { width: 1280, height: 720, facingMode: 'user' } }`
- Streams to a `<video>` element via `srcObject`
- `captureFrameBlob()` draws a video frame to `<canvas>` and returns a JPEG Blob

### Frame Capture Loop (Attendance Session)
- Sends a frame to `POST /face/recognize` every **1200 ms**
- Backend returns recognised students with confidence scores
- Frontend requires **3 consistent verifications** before marking a student present
- `useAttendanceSession` manages session state: `idle → active → completed`

### Face Registration (Students)
- Student opens camera in Profile page
- Captures a single frame → sends to `POST /face/register` as `multipart/form-data`
- Backend stores the face embedding in the `face_data` table

### Camera Requirements
- HTTPS or `localhost` is required for browser camera access
- User must grant camera permission in the browser
- Tested on: Chrome 120+, Edge 120+, Firefox 121+

---

## Backend Integration

All API calls go through `src/services/api.js`. The base URL is set via `VITE_API_URL`.

### Endpoints Used

| Service | Endpoint |
|---------|----------|
| Auth | `GET /users/registration/{reg_no}` |
| Users | `POST /users`, `GET /users/{id}`, `PUT /users/{id}` |
| Classes | `GET /classes`, `GET /classes/{id}`, `POST /classes` |
| Slots | `GET /classes/{id}/slots`, `POST /classes/{id}/slots`, `PUT /slots/{id}`, `DELETE /slots/{id}` |
| Enrollments | `POST /enrollments`, `GET /students/{id}/enrollments`, `GET /classes/{id}/students`, `DELETE /enrollments/{id}` |
| Attendance | `POST /attendance`, `GET /students/{id}/attendance`, `GET /classes/{id}/attendance` |
| Face | `POST /face/register`, `POST /face/recognize` |

> All endpoints match the contracts defined in `backend_api.md` exactly. No invented endpoints.

### CORS
The FastAPI backend must allow requests from the frontend origin. In `backend/app/main.py`, ensure:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Test Accounts (Seeded Data)

From `database/seed.sql`:

### Teachers
| Registration No. | Name | Password |
|-----------------|------|----------|
| `FAC001` | Amit Sharma | `password123` |
| `FAC002` | Priya Singh | `password123` |
| `FAC003` | Rahul Verma | `password123` |
| `FAC004` | Neha Gupta | `password123` |
| `FAC005` | Vikram Mehta | `password123` |

### Students
| Registration No. | Password |
|-----------------|----------|
| `STU001` – `STU030` | `password123` |

### Seeded Classes
| ID | Name | Teacher |
|----|------|---------|
| 1 | Data Structures | FAC001 (Amit Sharma) |
| 2 | Database Management Systems | FAC002 (Priya Singh) |

---

## Running Backend Alongside

```bash
# Terminal 1 — Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Make sure `VITE_API_URL=http://localhost:8000` in `frontend/.env`.

---

## Known Limitations

| Limitation | Details |
|-----------|---------|
| No JWT auth | Backend doesn't issue tokens yet; password check is client-side only |
| Teacher filtering | Dashboard filters classes by `teacher_id` matching logged-in user |
| Duplicate attendance | Backend returns `409` on duplicate; frontend shows a warning and skips gracefully |
| Face recognition demo | If no backend is running, the session page shows UI but API calls will fail |
| Single face embedding | Backend supports one embedding per student; re-registering overwrites the previous one |

---

## Contributing

All frontend work must stay on the `frontend` branch. Do not modify `main`, `backend`, or `database` branches.

```
frontend branch  ← all React/Vite/Tailwind changes go here
main             ← do not touch
backend          ← do not touch
database         ← do not touch
```
