'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTechnologies } from '@/hooks/useTechnologies';
import { TechnologiesTable } from '@/components/tables/TechnologiesTable';
import { Loading } from '@/components/common/Loading';
import { ErrorAlert } from '@/components/common/ErrorAlert';

export default function TechnologiesPage() {
  const { technologies, loading, error, delete: deleteTech } = useTechnologies();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta tecnologia?')) return;

    try {
      setDeleteError(null);
      await deleteTech(id);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erro ao deletar tecnologia');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-heading">Tecnologias</h1>
        <Link href="/technologies/new" className="btn-primary">
          + Nova Tecnologia
        </Link>
      </div>

      {error && <ErrorAlert message={error} />}
      {deleteError && <ErrorAlert message={deleteError} onClose={() => setDeleteError(null)} />}

      {loading ? <Loading /> : <TechnologiesTable technologies={technologies} onDelete={handleDelete} />}
    </div>
  );
}
