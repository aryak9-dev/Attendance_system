import api from './api';

/**
 * Face Recognition API service.
 * Corresponds to backend service in app/services/face_recognition.py.
 */
export const faceApi = {
  // POST /face/register
  registerFace: async (studentId, imageBlob) => {
    const formData = new FormData();
    formData.append('student_id', studentId);
    formData.append('file', imageBlob, 'face.jpg');
    return api.post('/face/register', formData);
  },

  // POST /face/recognize
  recognizeFace: async (imageBlob) => {
    const formData = new FormData();
    formData.append('file', imageBlob, 'frame.jpg');
    return api.post('/face/recognize', formData);
  },
};

export default faceApi;
