'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicationSchema, ApplicationFormData } from '@/schemas/application.schema';
import { Application } from '@/types';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { useState } from 'react';

interface ApplicationFormProps {
  initialData?: Application;
  onSubmit: (data: ApplicationFormData) => Promise<void>;
  isLoading?: boolean;
}

export const ApplicationForm = ({ initialData, onSubmit, isLoading = false }: ApplicationFormProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: initialData?.name || '',
      active: initialData?.active || false,
    },
  });

  const handleFormSubmit = async (data: ApplicationFormData) => {
    try {
      setError(null);
      await onSubmit(data);
      router.push('/applications');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar aplicação');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nome da Aplicação
        </label>
        <input
          {...register('name')}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Ex: Minha App"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div className="mb-4 flex items-center">
        <input {...register('active')} type="checkbox" id="active" className="w-4 h-4 text-primary rounded" />
        <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
          Ativa
        </label>
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
