import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://tutorial-plataform-api-1.onrender.com'
  // baseURL: 'http://localhost:3000'
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@tutorials:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('@tutorials:refreshToken');

        if (!refreshToken) {
          logoutLocal();
          return Promise.reject(error);
        }

        const response = await axios.post('https://tutorial-platform-api1.onrender.com/users/refresh', {
          refreshToken,
        });

        const { accessToken } = response.data;

        localStorage.setItem('@tutorials:token', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        logoutLocal();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

function logoutLocal() {
  localStorage.removeItem('@tutorials:user');
  localStorage.removeItem('@tutorials:token');
  localStorage.removeItem('@tutorials:refreshToken');
  window.location.href = '/login';
}