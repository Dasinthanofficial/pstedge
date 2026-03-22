import axios from 'axios';
import { clearAdminAuth } from './auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true
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