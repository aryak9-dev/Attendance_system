import api from './api';

/**
 * Slots API service.
 * Corresponds to backend endpoints in app/routes/slots.py.
 */
export const slotApi = {
  // GET /classes/{class_id}/slots
  getClassSlots: (classId) => api.get(`/classes/${classId}/slots`),

  // GET /slots (global list if supported)
  getSlots: () => api.get('/slots'),

  // POST /classes/{class_id}/slots
  createSlot: (classId, slotData) => api.post(`/classes/${classId}/slots`, slotData),

  // PUT /slots/{slot_id}
  updateSlot: (slotId, slotData) => api.put(`/slots/${slotId}`, slotData),

  // DELETE /slots/{slot_id}
  deleteSlot: (slotId) => api.delete(`/slots/${slotId}`),
};

export default slotApi;
