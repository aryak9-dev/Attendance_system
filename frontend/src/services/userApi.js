import api from './api';

/**
 * Users API service.
 * Corresponds exactly to backend endpoints in app/routes/users.py.
 */
export const userApi = {
  // GET /users
  getUsers: () => api.get('/users'),

  // GET /users/{user_id}
  getUserById: (userId) => api.get(`/users/${userId}`),

  // GET /users/registration/{registration_number}
  getUserByRegistrationNumber: (regNo) =>
    api.get(`/users/registration/${encodeURIComponent(regNo.trim())}`),

  // POST /users
  createUser: (userData) => api.post('/users', userData),

  // PUT /users/{user_id}
  updateUser: (userId, updateData) => api.put(`/users/${userId}`, updateData),
};

export default userApi;
