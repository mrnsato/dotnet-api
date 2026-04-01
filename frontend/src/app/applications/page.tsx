'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApplications } from '@/hooks/useApplications';
import { ApplicationsTable } from '@/components/tables/ApplicationsTable';
import { Loading } from '@/components/common/Loading';
import { ErrorAlert } from '@/components/common/ErrorAlert';

export default function ApplicationsPage() {
  const { applications, loading, error, delete: deleteApplication } = useApplications();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta aplicação?')) return;

    try {
      setDeleteError(null);
      await deleteApplication(id);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erro ao deletar aplicação');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-heading">Aplicações</h1>
        <Link href="/applications/new" className="btn-primary">
          + Nova Aplicação
        </Link>
      </div>

      {error && <ErrorAlert message={error} />}
      {deleteError && <ErrorAlert message={deleteError} onClose={() => setDeleteError(null)} />}

      {loading ? <Loading /> : <ApplicationsTable applications={applications} onDelete={handleDelete} />}
    </div>
  );
}
