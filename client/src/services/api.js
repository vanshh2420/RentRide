import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Auth Token if in LocalStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rentride_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error payloads & handle 401
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An unexpected error occurred';

    if (!error.response) {
      // Backend server is not reachable / network offline
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        message = 'Unable to connect to the server. Please ensure the backend is running.';
      } else {
        message = error.message || 'Unable to connect to the server. Please try again.';
      }
    } else {
      const status = error.response.status;
      if (status === 404) {
        message = error.response.data?.message || 'The requested resource was not found (404).';
      } else if (status === 503) {
        message = error.response.data?.message || 'Service or database temporarily unavailable. Please try again shortly.';
      } else if (status >= 500) {
        message = error.response.data?.message || 'Internal server error. Please try again later.';
      } else {
        message = error.response.data?.message || error.message || 'Request failed';
      }
    }

    const customError = {
      message,
      statusCode: error.response?.status || 0,
      errors: error.response?.data?.errors || [],
    };

    const reqUrl = error.config?.url || '';
    const isAuthRoute = reqUrl.includes('/auth/login') || reqUrl.includes('/auth/register');
    const hadAuthHeader = Boolean(error.config?.headers?.Authorization);

    if (error.response?.status === 401 && hadAuthHeader && !isAuthRoute) {
      // Clear token only if an existing authenticated session token expired/invalidated
      localStorage.removeItem('rentride_token');
      localStorage.removeItem('rentride_user');
    }

    return Promise.reject(customError);
  }
);

export default api;

