# Attendance Management System — Backend

**Project:** Attendance Management System  
**Component:** Backend  
**Document:** Backend Architecture & Structure Reference

This document is the reference for the backend structure. If this file is shared independently, it identifies the project and explains what each backend folder/file is responsible for.

## Project Context

The Attendance Management System manages students, teachers, classes, weekly class slots, enrollments, and attendance. Face embeddings will be used for attendance verification.

Initial development uses seeded/test data. Authentication and full user registration can be added later.

## Overall Project Structure

```text
attendance-system/
├── frontend/       # Student and Teacher UI
├── backend/        # FastAPI APIs and business logic
└── database/       # PostgreSQL schema and seed data
    ├── schema.sql
    └── seed.sql
```

## Backend Structure

```text
backend/
├── app/
│   ├── main.py
│   ├── database.py
│   │
│   ├── models/
│   │   ├── user.py
│   │   ├── class_model.py
│   │   ├── slot.py
│   │   ├── enrollment.py
│   │   ├── attendance.py
│   │   └── face_data.py
│   │
│   ├── schemas/
│   │   ├── user.py
│   │   ├── class_schema.py
│   │   ├── slot.py
│   │   ├── enrollment.py
│   │   └── attendance.py
│   │
│   ├── routes/
│   │   ├── users.py
│   │   ├── classes.py
│   │   ├── slots.py
│   │   ├── enrollments.py
│   │   └── attendance.py
│   │
│   └── services/
│       └── face_recognition.py
│
├── requirements.txt
├── .env
├── .env.example
└── README.md
```

## Folder Responsibilities

### `app/`
Main Python application package containing the FastAPI app, database connection, models, API schemas, routes, and services.

### `main.py`
FastAPI entry point. Creates the application and registers API routers.

### `database.py`
Configures the PostgreSQL connection and SQLAlchemy sessions.

### `models/`
Contains SQLAlchemy models representing PostgreSQL tables.

- `user.py` — students and teachers/users
- `class_model.py` — classes/courses
- `slot.py` — weekly class schedules/slots
- `enrollment.py` — student-to-class relationships
- `attendance.py` — attendance records
- `face_data.py` — stored student face embeddings

### `schemas/`
Contains Pydantic request/response schemas. Used mainly for API data validation and serialization.

> This is different from `database/schema.sql`.

### `routes/`
Contains REST API endpoints, grouped by feature.

- `users.py` — student/teacher/user APIs
- `classes.py` — class APIs
- `slots.py` — schedule/slot APIs
- `enrollments.py` — student enrollment APIs
- `attendance.py` — attendance APIs

### `services/`
Contains reusable business logic.

- `face_recognition.py` — face detection, embedding generation/comparison, and student identification logic

### `requirements.txt`
Lists Python dependencies required by the backend.

### `.env`
Contains local/environment configuration such as the database connection string. Real secrets must not be committed.

### `.env.example`
Template showing required environment variables without real secrets.

## Database Files

The SQL files are kept outside the backend:

```text
database/
├── schema.sql
└── seed.sql
```

### `schema.sql`
Creates the PostgreSQL database structure: tables, columns, relationships, and constraints.

### `seed.sql`
Adds initial development/test data such as students, teachers, classes, slots, enrollments, and attendance.

Normal runtime operations do **not** edit these files. For example, when a student registers later:

```text
Frontend
  ↓
POST /students
  ↓
FastAPI route
  ↓
Pydantic schema
  ↓
SQLAlchemy model
  ↓
PostgreSQL
```

## Important Distinction

```text
database/schema.sql
    → creates the PostgreSQL structure

backend/app/schemas/
    → validates API request/response data

backend/app/models/
    → Python/SQLAlchemy representation of database tables
```

## Backend Data Flow

```text
Frontend
   ↓
HTTP Request
   ↓
routes/
   ↓
schemas/
   ↓
services / database logic
   ↓
models/
   ↓
SQLAlchemy
   ↓
PostgreSQL
```

## Development Approach

Each developer uses their own local PostgreSQL database.

The common `schema.sql` and `seed.sql` files in GitHub allow everyone to create the same starting database.

Docker is **not required during the initial development stage**. The project will be Dockerized later when the application is complete and ready for deployment.

## Planned Development Order

```text
1. PostgreSQL setup
       ↓
2. FastAPI setup
       ↓
3. Database connection
       ↓
4. SQLAlchemy models
       ↓
5. API schemas
       ↓
6. REST routes
       ↓
7. Attendance logic
       ↓
8. Face-embedding integration
       ↓
9. Frontend integration
       ↓
10. Testing
       ↓
11. Dockerization
       ↓
12. Deployment
```

## Team Git Workflow

Each feature should be developed on a separate branch and merged into `main` through a Pull Request.

```text
main
├── feature/backend
├── feature/frontend
├── feature/face-recognition
└── feature/database
```

The `main` branch should contain stable/integrated code.

## Architecture at a Glance

```text
                 Attendance Management System
                            │
             ┌──────────────┼──────────────┐
             ↓              ↓              ↓
         Frontend        Backend        Database
                            │              │
                       ┌────┴────┐         │
                       ↓         ↓         │
                    Routes    Services     │
                       │         │          │
                       └────┬────┘          │
                            ↓               │
                         Models             │
                            ↓               │
                        SQLAlchemy          │
                            ↓               │
                        PostgreSQL ←────────┘
```

## Key Rule

Keep responsibilities separated:

```text
SQL files     → database setup
Models        → database representation
Schemas       → API validation/serialization
Routes        → API endpoints
Services      → business logic
Frontend      → user interface
```

This structure can evolve as the project grows, but new folders/files should be added only when they provide a clear benefit.
