import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { Technology } from '@/types';

export const technologyService = {
  async getAll(): Promise<Technology[]> {
    const response = await api.get<Technology[]>(API_ENDPOINTS.TECHNOLOGIES);
    return response.data;
  },

  async getById(id: number): Promise<Technology> {
    const response = await api.get<Technology>(API_ENDPOINTS.TECHNOLOGY_BY_ID(id));
    return response.data;
  },

  async create(data: Pick<Technology, 'name'>): Promise<Technology> {
    const response = await api.post<Technology>(API_ENDPOINTS.TECHNOLOGIES, data);
    return response.data;
  },

  async update(id: number, data: Pick<Technology, 'name'>): Promise<Technology> {
    const response = await api.put<Technology>(API_ENDPOINTS.TECHNOLOGY_BY_ID(id), data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.TECHNOLOGY_BY_ID(id));
    } catch (error: any) {
      // Extrai a mensagem do backend (string direta ou objeto { message: "..." }
      throw new Error('Não é possível deletar essa tecnologia. Ela pode estar associada a projetos ou ter outras dependências.');
    }
  },
};
