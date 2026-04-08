'use client';
import { useState, useEffect, useCallback } from 'react';
import { Technology } from '@/types';
import { technologyService } from '@/services/technologyService';
import { getErrorMessage } from '@/lib/utils';

interface UseTechnologiesReturn {
  technologies: Technology[];
  loading: boolean;
  error: string | null;
  deleteError: string | null;        // 👈 novo
  clearDeleteError: () => void;      // 👈 novo
  refetch: () => Promise<void>;
  create: (data: Pick<Technology, 'name'>) => Promise<Technology>;
  update: (id: number, data: Pick<Technology, 'name'>) => Promise<Technology>;
  delete: (id: number) => Promise<void>;
}

export const useTechnologies = (): UseTechnologiesReturn => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null); // 👈 novo

  const fetchTechnologies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await technologyService.getAll();
      setTechnologies(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTechnologies();
  }, [fetchTechnologies]);

  const create = async (data: Pick<Technology, 'name'>): Promise<Technology> => {
    try {
      const newTechnology = await technologyService.create(data);
      setTechnologies([...technologies, newTechnology]);
      return newTechnology;
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      throw err;
    }
  };

  const update = async (id: number, data: Pick<Technology, 'name'>): Promise<Technology> => {
    try {
      const updated = await technologyService.update(id, data);
      setTechnologies(technologies.map((t) => (t.id === id ? updated : t)));
      return updated;
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      throw err;
    }
  };

  const deleteItem = async (id: number): Promise<void> => {
    try {
      setDeleteError(null); // 👈 limpa erro anterior antes de tentar
      await technologyService.delete(id);
      setTechnologies(technologies.filter((t) => t.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    technologies,
    loading,
    error,
    deleteError,                          // 👈 novo
    clearDeleteError: () => setDeleteError(null), // 👈 novo
    refetch: fetchTechnologies,
    create,
    update,
    delete: deleteItem,
  };
};