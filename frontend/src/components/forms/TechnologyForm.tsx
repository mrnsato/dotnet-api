'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { technologySchema, TechnologyFormData } from '@/schemas/technology.schema';
import { Technology } from '@/types';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { useState } from 'react';

interface TechnologyFormProps {
  initialData?: Technology;
  onSubmit: (data: TechnologyFormData) => Promise<void>;
  isLoading?: boolean;
}

export const TechnologyForm = ({ initialData, onSubmit, isLoading = false }: TechnologyFormProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TechnologyFormData>({
    resolver: zodResolver(technologySchema),
    defaultValues: {
      name: initialData?.name || '',
    },
  });

  const handleFormSubmit = async (data: TechnologyFormData) => {
    try {
      setError(null);
      await onSubmit(data);
      router.push('/technologies');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar tecnologia');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nome da Tecnologia
        </label>
        <input
          {...register('name')}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Ex: .NET, Node.js, Python"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-primary text-white py-2 rounded hover:opacity-80 disabled:opacity-50"
        >
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
