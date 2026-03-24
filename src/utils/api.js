import axios from 'axios';
import { clearAdminAuth } from './auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const pathname = window.location.pathname;
    const requestUrl = error.config?.url || '';

    const isAdminRoute = pathname.startsWith('/admin');
    const isLoginPage = pathname === '/admin/login';
    const isLoginRequest = requestUrl.includes('/api/auth/login');

    if (status === 401) {
      clearAdminAuth();

      if (isAdminRoute && !isLoginPage && !isLoginRequest) {
        window.location.replace('/admin/login');
      }
    }

    return Promise.reject(error);
  }
);

export default api;