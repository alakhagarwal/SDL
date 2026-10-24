import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wellness_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-logout if failed on the login endpoint itself
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('wellness_token');
        localStorage.removeItem('wellness_user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
