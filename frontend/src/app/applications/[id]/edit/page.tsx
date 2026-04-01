'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ApplicationForm } from '@/components/forms/ApplicationForm';
import { Loading } from '@/components/common/Loading';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { applicationService } from '@/services/applicationService';
import { Application } from '@/types';

export default function EditApplicationPage() {
  const params = useParams();
  const id = Number(params.id);
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const data = await applicationService.getById(id);
        setApplication(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar aplicação');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await applicationService.update(id, data);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;
  if (!application) return <ErrorAlert message="Aplicação não encontrada" />;

  return (
    <div>
      <h1 className="text-heading mb-8">Editar Aplicação</h1>
      <ApplicationForm initialData={application} onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
}
