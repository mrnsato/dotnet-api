'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { versionSchema, VersionFormData } from '@/schemas/version.schema';
import { Version, Technology } from '@/types';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { useState } from 'react';

interface VersionFormProps {
  initialData?: Version;
  technologies: Technology[];
  onSubmit: (data: VersionFormData) => Promise<void>;
  isLoading?: boolean;
}

export const VersionForm = ({
  initialData,
  technologies,
  onSubmit,
  isLoading = false,
}: VersionFormProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VersionFormData>({
    resolver: zodResolver(versionSchema),
    defaultValues: {
      name: initialData?.name || '',
      technologiesId: initialData?.technologiesId || 0,
      standard: initialData?.standard || false,
      fullName: initialData?.fullName || '',
      eos: initialData?.eos || null,
      eol: initialData?.eol || null,
    },
  });

  const handleFormSubmit = async (data: VersionFormData) => {
    try {
      setError(null);
      await onSubmit(data);
      router.push('/versions');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar versão');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="max-w-md mx-auto bg-white p-6 rounded shadow">
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      <div className="mb-4">
        <label htmlFor="technologiesId" className="block text-sm font-medium text-gray-700 mb-2">
          Tecnologia
        </label>
        <select
          {...register('technologiesId', { valueAsNumber: true })}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Selecione uma tecnologia</option>
          {technologies.map((tech) => (
            <option key={tech.id} value={tech.id}>
              {tech.name}
            </option>
          ))}
        </select>
        {errors.technologiesId && <p className="text-red-500 text-sm mt-1">{errors.technologiesId.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nome
        </label>
        <input
          {...register('name')}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Ex: 10.0"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
          Nome Completo
        </label>
        <input
          {...register('fullName')}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Ex: .NET 10.0"
        />
        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
      </div>

      <div className="mb-4 flex items-center">
        <input
          {...register('standard')}
          type="checkbox"
          id="standard"
          className="w-4 h-4 text-primary rounded"
        />
        <label htmlFor="standard" className="ml-2 text-sm font-medium text-gray-700">
          Padrão
        </label>
      </div>

      <div className="mb-4">
        <label htmlFor="eos" className="block text-sm font-medium text-gray-700 mb-2">
          EOS (End of Support)
        </label>
        <input
          {...register('eos')}
          type="date"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="eol" className="block text-sm font-medium text-gray-700 mb-2">
          EOL (End of Life)
        </label>
        <input
          {...register('eol')}
          type="date"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
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
