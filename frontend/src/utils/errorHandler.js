/**
 * Parses API errors into user-friendly messages without exposing raw stack traces.
 */
export function parseApiError(error) {
  if (!error) return 'An unexpected error occurred.';

  // If error has a response from fetch / axios
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    if (data && data.detail) {
      if (typeof data.detail === 'string') {
        return data.detail;
      }
      if (Array.isArray(data.detail) && data.detail.length > 0) {
        // FastAPI validation errors (422)
        return data.detail.map(d => `${d.loc ? d.loc.slice(1).join(' ') + ': ' : ''}${d.msg}`).join(', ');
      }
    }

    switch (status) {
      case 400:
        return 'Invalid request or class capacity is full.';
      case 401:
        return 'Session expired or unauthorized. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Requested record or user not found.';
      case 409:
        return 'A record with this registration number or schedule conflict already exists.';
      case 422:
        return 'Please ensure all submitted form fields are valid.';
      case 500:
        return 'Something went wrong on the server. Please try again later.';
      default:
        return `Request failed with status ${status}.`;
    }
  }

  // Network / connection error
  if (error.request || error.message?.includes('NetworkError') || error.message?.includes('Failed to fetch')) {
    return 'Unable to connect to the backend server. Please verify FastAPI is running at http://localhost:8000.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
}
