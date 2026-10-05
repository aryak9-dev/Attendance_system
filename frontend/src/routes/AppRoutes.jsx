import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import TeacherLayout from '../layouts/TeacherLayout';
import StudentLayout from '../layouts/StudentLayout';

// Components
import ProtectedRoute from '../components/ProtectedRoute';

// Public Pages
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';

// Teacher Pages
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import TeacherClasses from '../pages/teacher/TeacherClasses';
import TeacherClassDetails from '../pages/teacher/TeacherClassDetails';
import TeacherStudents from '../pages/teacher/TeacherStudents';
import StartAttendance from '../pages/teacher/StartAttendance';
import AttendanceSession from '../pages/teacher/AttendanceSession';
import AttendanceReview from '../pages/teacher/AttendanceReview';
import AttendanceHistory from '../pages/teacher/AttendanceHistory';
import Reports from '../pages/teacher/Reports';
import TeacherProfile from '../pages/teacher/TeacherProfile';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import AvailableClasses from '../pages/student/AvailableClasses';
import MyClasses from '../pages/student/MyClasses';
import StudentClassDetails from '../pages/student/StudentClassDetails';
import MyAttendance from '../pages/student/MyAttendance';
import StudentProfile from '../pages/student/StudentProfile';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Teacher Protected Routes */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRole="teacher">
            <TeacherLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/teacher/dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="classes" element={<TeacherClasses />} />
        <Route path="classes/:classId" element={<TeacherClassDetails />} />
        <Route path="students" element={<TeacherStudents />} />
        <Route path="attendance" element={<StartAttendance />} />
        <Route path="attendance/session" element={<AttendanceSession />} />
        <Route path="attendance/review" element={<AttendanceReview />} />
        <Route path="history" element={<AttendanceHistory />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<TeacherProfile />} />
      </Route>

      {/* Student Protected Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="classes" element={<AvailableClasses />} />
        <Route path="my-classes" element={<MyClasses />} />
        <Route path="classes/:classId" element={<StudentClassDetails />} />
        <Route path="attendance" element={<MyAttendance />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
