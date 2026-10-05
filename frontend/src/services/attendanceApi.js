import api from './api';

/**
 * Attendance API service.
 * Corresponds to backend endpoints in app/routes/attendance.py.
 */
export const attendanceApi = {
  // POST /attendance
  markAttendance: ({ enrollment_id, slot_id, date, status }) =>
    api.post('/attendance', {
      enrollment_id,
      slot_id,
      date,
      status: status.toLowerCase(), // Must be 'present' or 'absent'
    }),

  // GET /attendance/{attendance_id}
  getAttendanceById: (attendanceId) =>
    api.get(`/attendance/${attendanceId}`),

  // GET /students/{student_id}/attendance
  getStudentAttendance: (studentId) =>
    api.get(`/students/${studentId}/attendance`),

  // GET /classes/{class_id}/attendance
  getClassAttendance: (classId) =>
    api.get(`/classes/${classId}/attendance`),

  // GET /attendance (all attendance records)
  getAllAttendance: () => api.get('/attendance'),
};

export default attendanceApi;
