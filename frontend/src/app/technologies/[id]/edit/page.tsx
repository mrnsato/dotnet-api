'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { TechnologyForm } from '@/components/forms/TechnologyForm';
import { Loading } from '@/components/common/Loading';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { technologyService } from '@/services/technologyService';
import { Technology } from '@/types';

export default function EditTechnologyPage() {
  const params = useParams();
  const id = Number(params.id);
  const [technology, setTechnology] = useState<Technology | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTechnology = async () => {
      try {
        setLoading(true);
        const data = await technologyService.getById(id);
        setTechnology(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar tecnologia');
      } finally {
        setLoading(false);
      }
    };

    fetchTechnology();
  }, [id]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await technologyService.update(id, data);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;
  if (!technology) return <ErrorAlert message="Tecnologia não encontrada" />;

  return (
    <div>
      <h1 className="text-heading mb-8">Editar Tecnologia</h1>
      <TechnologyForm initialData={technology} onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
}
