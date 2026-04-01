'use client';

import { useState } from 'react';
import { ApplicationForm } from '@/components/forms/ApplicationForm';
import { applicationService } from '@/services/applicationService';

export default function NewApplicationPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await applicationService.create(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-heading mb-8">Nova Aplicação</h1>
      <ApplicationForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
