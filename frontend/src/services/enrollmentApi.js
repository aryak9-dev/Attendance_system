import api from './api';

/**
 * Enrollment API service.
 * Corresponds to backend endpoints in app/routes/enrollments.py.
 */
export const enrollmentApi = {
  // POST /enrollments
  enrollStudent: (studentId, classId) =>
    api.post('/enrollments', { student_id: studentId, class_id: classId }),

  // GET /students/{student_id}/enrollments
  getStudentEnrollments: (studentId) =>
    api.get(`/students/${studentId}/enrollments`),

  // GET /classes/{class_id}/students
  getClassStudents: (classId) =>
    api.get(`/classes/${classId}/students`),

  // GET /enrollments
  getAllEnrollments: () => api.get('/enrollments'),

  // DELETE /enrollments/{enrollment_id}
  removeEnrollment: (enrollmentId) =>
    api.delete(`/enrollments/${enrollmentId}`),
};

export default enrollmentApi;
