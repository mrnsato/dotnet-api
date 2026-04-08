'use client';

import { useState, useEffect, useCallback } from 'react';
import { Application } from '@/types';
import { applicationService } from '@/services/applicationService';
import { getErrorMessage } from '@/lib/utils';

interface UseApplicationsReturn {
  applications: Application[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  create: (data: Pick<Application, 'name' | 'active'>) => Promise<Application>;
  update: (id: number, data: Pick<Application, 'name' | 'active'>) => Promise<Application>;
  delete: (id: number) => Promise<void>;
  getActive: () => Promise<Application[]>;
}

export const useApplications = (): UseApplicationsReturn => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await applicationService.getAll();
      setApplications(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const create = async (data: Pick<Application, 'name' | 'active'>): Promise<Application> => {
    try {
      const newApplication = await applicationService.create(data);
      setApplications([...applications, newApplication]);
      return newApplication;
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      throw err;
    }
  };

  const update = async (
    id: number,
    data: Pick<Application, 'name' | 'active'>
  ): Promise<Application> => {
    try {
      const updated = await applicationService.update(id, data);
      setApplications(applications.map((a) => (a.id === id ? updated : a)));
      return updated;
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      throw err;
    }
  };

  const deleteItem = async (id: number): Promise<void> => {
    try {
      await applicationService.delete(id);
      setApplications(applications.filter((a) => a.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const getActive = async (): Promise<Application[]> => {
    try {
      const data = await applicationService.getActive();
      return data;
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      throw err;
    }
  };

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
    create,
    update,
    delete: deleteItem,
    getActive,
  };
};
