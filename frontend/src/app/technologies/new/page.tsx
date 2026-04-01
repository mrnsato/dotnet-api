'use client';

import { useState } from 'react';
import { TechnologyForm } from '@/components/forms/TechnologyForm';
import { technologyService } from '@/services/technologyService';

export default function NewTechnologyPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await technologyService.create(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-heading mb-8">Nova Tecnologia</h1>
      <TechnologyForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
