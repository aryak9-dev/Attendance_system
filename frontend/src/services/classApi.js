import api from './api';

/**
 * Classes API service.
 * Corresponds exactly to backend endpoints in app/routes/classes.py.
 */
export const classApi = {
  // GET /classes
  getClasses: () => api.get('/classes'),

  // GET /classes/{class_id}
  getClassById: (classId) => api.get(`/classes/${classId}`),

  // POST /classes
  createClass: (classData) => api.post('/classes', classData),

  // PUT /classes/{class_id}
  updateClass: (classId, classData) => api.put(`/classes/${classId}`, classData),
};

export default classApi;
