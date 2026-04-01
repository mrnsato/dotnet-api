'use client';

import { useState } from 'react';
import { useTechnologies } from '@/hooks/useTechnologies';
import { VersionForm } from '@/components/forms/VersionForm';
import { Loading } from '@/components/common/Loading';
import { versionService } from '@/services/versionService';

export default function NewVersionPage() {
  const { technologies, loading } = useTechnologies();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await versionService.create(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-heading mb-8">Nova Versão</h1>
      <VersionForm technologies={technologies} onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
}
