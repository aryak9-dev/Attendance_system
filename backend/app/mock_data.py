from datetime import date, time

from sqlalchemy.orm import sessionmaker

from app.models import Attendance, Class, Enrollment, Slot, User, UserRole, WeekDay
from app.security import hash_password

TEACHERS = [
    ("Amit Sharma", "FAC001", "amit.sharma@college.com"),
    ("Priya Singh", "FAC002", "priya.singh@college.com"),
    ("Rahul Verma", "FAC003", "rahul.verma@college.com"),
    ("Neha Gupta", "FAC004", "neha.gupta@college.com"),
    ("Vikram Mehta", "FAC005", "vikram.mehta@college.com"),
]

STUDENTS = [
    ("Aarav Kumar", "STU001"),
    ("Aditya Singh", "STU002"),
    ("Ananya Sharma", "STU003"),
    ("Arjun Verma", "STU004"),
    ("Diya Gupta", "STU005"),
    ("Ishaan Patel", "STU006"),
    ("Kavya Mehta", "STU007"),
    ("Krish Malhotra", "STU008"),
    ("Meera Shah", "STU009"),
    ("Naman Joshi", "STU010"),
    ("Nisha Kapoor", "STU011"),
    ("Pranav Agarwal", "STU012"),
    ("Riya Jain", "STU013"),
    ("Rohan Gupta", "STU014"),
    ("Sakshi Verma", "STU015"),
    ("Shivam Yadav", "STU016"),
    ("Simran Kaur", "STU017"),
    ("Tanya Sharma", "STU018"),
    ("Varun Singh", "STU019"),
    ("Yash Patel", "STU020"),
    ("Aditi Rao", "STU021"),
    ("Dev Kumar", "STU022"),
    ("Harsh Mehta", "STU023"),
    ("Isha Gupta", "STU024"),
    ("Karan Shah", "STU025"),
    ("Maya Joshi", "STU026"),
    ("Nikhil Jain", "STU027"),
    ("Pooja Agarwal", "STU028"),
    ("Sameer Kapoor", "STU029"),
    ("Zoya Khan", "STU030"),
]


def seed_mock_data(factory: sessionmaker) -> None:
    with factory.begin() as db:
        password_hash = hash_password("password123")

        for index, (name, registration_number, email) in enumerate(TEACHERS, start=1):
            db.add(
                User(
                    id=index,
                    name=name,
                    registration_number=registration_number,
                    email=email,
                    password_hash=password_hash,
                    role=UserRole.teacher,
                )
            )

        for index, (name, registration_number) in enumerate(STUDENTS, start=6):
            db.add(
                User(
                    id=index,
                    name=name,
                    registration_number=registration_number,
                    email=f"{name.lower().replace(' ', '.')}@college.com",
                    password_hash=password_hash,
                    role=UserRole.student,
                )
            )

        db.add_all(
            [
                Class(
                    id=1,
                    name="Data Structures",
                    description="Study of fundamental data structures and algorithms",
                    teacher_id=1,
                    capacity=30,
                ),
                Class(
                    id=2,
                    name="Database Management Systems",
                    description="Fundamentals of relational databases and SQL",
                    teacher_id=2,
                    capacity=30,
                ),
            ]
        )

        slots = [
            (1, WeekDay.Monday, time(10), time(11)),
            (1, WeekDay.Wednesday, time(10), time(11)),
            (1, WeekDay.Friday, time(10), time(11)),
            (2, WeekDay.Tuesday, time(14), time(15)),
            (2, WeekDay.Thursday, time(14), time(15)),
            (2, WeekDay.Saturday, time(11), time(12)),
        ]
        db.add_all(
            [
                Slot(
                    id=index,
                    class_id=class_id,
                    day=day,
                    start_time=start_time,
                    end_time=end_time,
                )
                for index, (class_id, day, start_time, end_time) in enumerate(
                    slots,
                    start=1,
                )
            ]
        )

        enrollments = []
        for class_id, student_ids in (
            (1, range(6, 26)),
            (2, range(16, 36)),
        ):
            for student_id in student_ids:
                enrollment = Enrollment(student_id=student_id, class_id=class_id)
                db.add(enrollment)
                enrollments.append((class_id, student_id, enrollment))

        db.flush()

        attendance_sessions = {
            1: [
                (1, date(2026, 9, 7), 5),
                (2, date(2026, 9, 9), 4),
                (3, date(2026, 9, 11), 6),
            ],
            2: [
                (4, date(2026, 9, 8), 5),
                (5, date(2026, 9, 10), 4),
                (6, date(2026, 9, 12), 6),
            ],
        }
        db.add_all(
            [
                Attendance(
                    enrollment_id=enrollment.id,
                    slot_id=slot_id,
                    date=session_date,
                    status="absent" if enrollment.id % divisor == 0 else "present",
                )
                for class_id, _, enrollment in enrollments
                for slot_id, session_date, divisor in attendance_sessions[class_id]
            ]
        )
