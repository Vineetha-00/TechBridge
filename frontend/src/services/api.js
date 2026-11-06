import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to attach auth tokens or active mock demo user id
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tb_token');
  const userStr = localStorage.getItem('tb_user');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user && user.id) {
        config.headers['x-user-id'] = user.id;
      }
    } catch (e) {
      // Ignore parse error
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
