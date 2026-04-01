'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { VersionForm } from '@/components/forms/VersionForm';
import { Loading } from '@/components/common/Loading';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { useTechnologies } from '@/hooks/useTechnologies';
import { versionService } from '@/services/versionService';
import { Version } from '@/types';

export default function EditVersionPage() {
  const params = useParams();
  const id = Number(params.id);
  const { technologies, loading: techLoading } = useTechnologies();
  const [version, setVersion] = useState<Version | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        setLoading(true);
        const data = await versionService.getById(id);
        setVersion(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar versão');
      } finally {
        setLoading(false);
      }
    };

    fetchVersion();
  }, [id]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await versionService.update(id, data);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || techLoading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;
  if (!version) return <ErrorAlert message="Versão não encontrada" />;

  return (
    <div>
      <h1 className="text-heading mb-8">Editar Versão</h1>
      <VersionForm
        initialData={version}
        technologies={technologies}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
