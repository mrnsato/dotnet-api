import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { ApplicationVersion } from '@/types';

export const applicationVersionService = {
  async getAll(): Promise<ApplicationVersion[]> {
    const response = await api.get<ApplicationVersion[]>(API_ENDPOINTS.APPLICATION_VERSIONS);
    return response.data;
  },

  async getById(id: number): Promise<ApplicationVersion> {
    const response = await api.get<ApplicationVersion>(API_ENDPOINTS.APPLICATION_VERSION_BY_ID(id));
    return response.data;
  },

  async getByApplication(applicationId: number): Promise<ApplicationVersion[]> {
    const response = await api.get<ApplicationVersion[]>(
      API_ENDPOINTS.APPLICATION_VERSIONS_BY_APP(applicationId)
    );
    return response.data;
  },

  async getByVersion(versionId: number): Promise<ApplicationVersion[]> {
    const response = await api.get<ApplicationVersion[]>(
      API_ENDPOINTS.APPLICATION_VERSIONS_BY_VERSION(versionId)
    );
    return response.data;
  },

  async create(data: Pick<ApplicationVersion, 'applicationId' | 'versionId'>): Promise<ApplicationVersion> {
    try {
    const response = await api.post<ApplicationVersion>(API_ENDPOINTS.APPLICATION_VERSIONS, data);
     return response.data;
    } catch (error: any) {
      // Extrai a mensagem do backend (string direta ou objeto { message: "..." })
      throw new Error('Não é possível criar essa associação. Verifique se a aplicação e a versão existem e se já não estão associadas.');
    }
  },

  async update(
    id: number,
    data: Pick<ApplicationVersion, 'applicationId' | 'versionId'>
  ): Promise<ApplicationVersion> {
    try {
      const response = await api.put<ApplicationVersion>(API_ENDPOINTS.APPLICATION_VERSION_BY_ID(id), data);
      return response.data;
    } catch (error: any) {
      // Extrai a mensagem do backend (string direta ou objeto { message: "..." })
      throw new Error('Não é possível atualizar essa associação. Verifique se a aplicação e a versão existem e se já não estão associadas.');
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.APPLICATION_VERSION_BY_ID(id));
    } catch (error: any) {
      // Extrai a mensagem do backend (string direta ou objeto { message: "..." })
      throw new Error('Não é possível deletar essa associação. Ela pode estar associada a projetos ou ter outras dependências.');
    }
  },
};
