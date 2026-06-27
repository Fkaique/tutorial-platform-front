import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
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

        // Bate na rota de refresh do seu UserController
        const response = await axios.post('http://localhost:3000/users/refresh', {
          refreshToken,
        });

        const { accessToken } = response.data;

        // Salva o novo token gerado
        localStorage.setItem('@tutorials:token', accessToken);

        // Substitui o cabeçalho antigo pelo novo e refaz a requisição original falhada
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