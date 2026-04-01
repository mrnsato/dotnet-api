'use client';

import { useState, useEffect, useCallback } from 'react';
import { ApplicationVersion } from '@/types';
import { applicationVersionService } from '@/services/applicationVersionService';
import { getErrorMessage } from '@/lib/utils';

interface UseApplicationVersionsReturn {
  applicationVersions: ApplicationVersion[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  create: (data: Pick<ApplicationVersion, 'applicationId' | 'versionId'>) => Promise<ApplicationVersion>;
  update: (
    id: number,
    data: Pick<ApplicationVersion, 'applicationId' | 'versionId'>
  ) => Promise<ApplicationVersion>;
  delete: (id: number) => Promise<void>;
  getByApplication: (applicationId: number) => Promise<ApplicationVersion[]>;
  getByVersion: (versionId: number) => Promise<ApplicationVersion[]>;
}

export const useApplicationVersions = (): UseApplicationVersionsReturn => {
  const [applicationVersions, setApplicationVersions] = useState<ApplicationVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicationVersions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await applicationVersionService.getAll();
      setApplicationVersions(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplicationVersions();
  }, [fetchApplicationVersions]);

  const create = async (
    data: Pick<ApplicationVersion, 'applicationId' | 'versionId'>
  ): Promise<ApplicationVersion> => {
    try {
      const newAppVersion = await applicationVersionService.create(data);
      setApplicationVersions([...applicationVersions, newAppVersion]);
      return newAppVersion;
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      throw err;
    }
  };

  const update = async (
    id: number,
    data: Pick<ApplicationVersion, 'applicationId' | 'versionId'>
  ): Promise<ApplicationVersion> => {
    try {
      const updated = await applicationVersionService.update(id, data);
      setApplicationVersions(applicationVersions.map((av) => (av.id === id ? updated : av)));
      return updated;
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      throw err;
    }
  };

  const deleteItem = async (id: number): Promise<void> => {
    try {
      await applicationVersionService.delete(id);
      setApplicationVersions(applicationVersions.filter((av) => av.id !== id));
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      throw err;
    }
  };

  const getByApplication = async (applicationId: number): Promise<ApplicationVersion[]> => {
    try {
      const data = await applicationVersionService.getByApplication(applicationId);
      return data;
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      throw err;
    }
  };

  const getByVersion = async (versionId: number): Promise<ApplicationVersion[]> => {
    try {
      const data = await applicationVersionService.getByVersion(versionId);
      return data;
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      throw err;
    }
  };

  return {
    applicationVersions,
    loading,
    error,
    refetch: fetchApplicationVersions,
    create,
    update,
    delete: deleteItem,
    getByApplication,
    getByVersion,
  };
};
