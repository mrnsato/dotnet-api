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
    const response = await api.post<ApplicationVersion>(API_ENDPOINTS.APPLICATION_VERSIONS, data);
    return response.data;
  },

  async update(
    id: number,
    data: Pick<ApplicationVersion, 'applicationId' | 'versionId'>
  ): Promise<ApplicationVersion> {
    const response = await api.put<ApplicationVersion>(API_ENDPOINTS.APPLICATION_VERSION_BY_ID(id), data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(API_ENDPOINTS.APPLICATION_VERSION_BY_ID(id));
  },
};
