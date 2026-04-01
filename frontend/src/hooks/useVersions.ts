'use client';

import { useState, useEffect, useCallback } from 'react';
import { Version } from '@/types';
import { versionService } from '@/services/versionService';
import { getErrorMessage } from '@/lib/utils';

interface UseVersionsReturn {
  versions: Version[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  create: (data: Omit<Version, 'id' | 'technologyName'>) => Promise<Version>;
  update: (id: number, data: Omit<Version, 'id' | 'technologyName'>) => Promise<Version>;
  delete: (id: number) => Promise<void>;
  getByTechnology: (technologyId: number) => Promise<Version[]>;
}

export const useVersions = (): UseVersionsReturn => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVersions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await versionService.getAll();
      setVersions(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  const create = async (data: Omit<Version, 'id' | 'technologyName'>): Promise<Version> => {
    try {
      const newVersion = await versionService.create(data);
      setVersions([...versions, newVersion]);
      return newVersion;
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      throw err;
    }
  };

  const update = async (
    id: number,
    data: Omit<Version, 'id' | 'technologyName'>
  ): Promise<Version> => {
    try {
      const updated = await versionService.update(id, data);
      setVersions(versions.map((v) => (v.id === id ? updated : v)));
      return updated;
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      throw err;
    }
  };

  const deleteItem = async (id: number): Promise<void> => {
    try {
      await versionService.delete(id);
      setVersions(versions.filter((v) => v.id !== id));
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      throw err;
    }
  };

  const getByTechnology = async (technologyId: number): Promise<Version[]> => {
    try {
      const data = await versionService.getByTechnology(technologyId);
      return data;
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      throw err;
    }
  };

  return {
    versions,
    loading,
    error,
    refetch: fetchVersions,
    create,
    update,
    delete: deleteItem,
    getByTechnology,
  };
};
