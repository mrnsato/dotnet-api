import axios, { AxiosError, AxiosInstance } from 'axios';

// ✅ Garantir que a URL seja lida corretamente
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://dotnet_api:8080';

// ✅ Log para debug (remova depois em produção)
console.log('API_BASE_URL configurada:', API_BASE_URL);

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // ✅ Timeout de 10 segundos
});

// Interceptor de requisição
api.interceptors.request.use(
  (config: { baseURL: any; url: any; }) => {
    // ✅ Log para debug (remova depois)
    console.log('Requisição para:', `${config.baseURL || API_BASE_URL}${config.url}`);
    return config;
  },
  (error: any) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor de resposta
api.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: AxiosError) => {
    // ✅ Melhor tratamento de erros
    if (error.code === 'ERR_NETWORK') {
      console.error('Erro de rede - API não está acessível em:', API_BASE_URL);
    } else if (error.response?.status === 404) {
      console.error('Recurso não encontrado:', error.config?.url);
    } else if (error.response?.status === 500) {
      console.error('Erro interno do servidor');
    } else {
      console.error('Erro na API:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;