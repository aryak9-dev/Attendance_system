from fastapi import FastAPI
from app.routes import users
from app.routes import users, classes, slots, enrollments


app = FastAPI(
    title="Attendance System API",
    description="Backend API for the Attendance Management System",
    version="1.0.0"
)

app.include_router(users.router)
app.include_router(classes.router)
app.include_router(slots.router)
app.include_router(enrollments.router)


@app.get("/")
def root():
    return {
        "message": "Attendance System API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }