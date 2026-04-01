import api from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
import { Version } from '@/types';

export const versionService = {
  async getAll(): Promise<Version[]> {
    const response = await api.get<Version[]>(API_ENDPOINTS.VERSIONS);
    return response.data;
  },

  async getById(id: number): Promise<Version> {
    const response = await api.get<Version>(API_ENDPOINTS.VERSION_BY_ID(id));
    return response.data;
  },

  async getByTechnology(technologyId: number): Promise<Version[]> {
    const response = await api.get<Version[]>(API_ENDPOINTS.VERSIONS_BY_TECHNOLOGY(technologyId));
    return response.data;
  },

  async create(data: Omit<Version, 'id' | 'technologyName'>): Promise<Version> {
    const response = await api.post<Version>(API_ENDPOINTS.VERSIONS, data);
    return response.data;
  },

  async update(id: number, data: Omit<Version, 'id' | 'technologyName'>): Promise<Version> {
    const response = await api.put<Version>(API_ENDPOINTS.VERSION_BY_ID(id), data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(API_ENDPOINTS.VERSION_BY_ID(id));
  },
};
