import axios from 'axios';
import { getAdminToken, clearAdminAuth } from './auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = getAdminToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAdminAuth();

      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;