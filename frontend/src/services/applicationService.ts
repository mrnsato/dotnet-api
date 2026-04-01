import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { Application } from '@/types';

export const applicationService = {
  async getAll(): Promise<Application[]> {
    const response = await api.get<Application[]>(API_ENDPOINTS.APPLICATIONS);
    return response.data;
  },

  async getById(id: number): Promise<Application> {
    const response = await api.get<Application>(API_ENDPOINTS.APPLICATION_BY_ID(id));
    return response.data;
  },

  async getActive(): Promise<Application[]> {
    const response = await api.get<Application[]>(API_ENDPOINTS.APPLICATIONS_ACTIVE);
    return response.data;
  },

  async create(data: Pick<Application, 'name' | 'active'>): Promise<Application> {
    const response = await api.post<Application>(API_ENDPOINTS.APPLICATIONS, data);
    return response.data;
  },

  async update(id: number, data: Pick<Application, 'name' | 'active'>): Promise<Application> {
    const response = await api.put<Application>(API_ENDPOINTS.APPLICATION_BY_ID(id), data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(API_ENDPOINTS.APPLICATION_BY_ID(id));
  },
};
