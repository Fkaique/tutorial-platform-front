import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. INTERCEPTOR DE REQUISIÇÃO: Coloca o Token automaticamente em todas as chamadas
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

// 2. INTERCEPTOR DE RESPOSTA: O "Cérebro" do Refresh Token e Blacklist
api.interceptors.response.use(
  (response) => response, // Se a requisição deu certo, só passa adiante
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 e não for uma tentativa repetida
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('@tutorials:refreshToken');
        
        if (!refreshToken) {
          // Se não tem refresh token, limpa tudo e manda pro login
          logoutLocal();
          return Promise.reject(error);
        }

        // Dispara a rota de renovação do seu backend Express
        const response = await axios.post('http://localhost:3000/users/refresh', {
          refreshToken,
        });

        const { accessToken } = response.data;

        // Salva o novo token ativo
        localStorage.setItem('@tutorials:token', accessToken);

        // Atualiza o token na requisição que tinha falhado e tenta de novo
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Se o próprio refresh token expirou ou foi invalidado na blacklist do banco
        logoutLocal();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Função auxiliar para limpar o estado local do app se a sessão cair
function logoutLocal() {
  localStorage.removeItem('@tutorials:user');
  localStorage.removeItem('@tutorials:token');
  localStorage.removeItem('@tutorials:refreshToken');
  window.location.href = '/login'; // Força o redirecionamento
}