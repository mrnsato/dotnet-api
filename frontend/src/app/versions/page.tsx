'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useVersions } from '@/hooks/useVersions';
import { VersionsTable } from '@/components/tables/VersionsTable';
import { Loading } from '@/components/common/Loading';
import { ErrorAlert } from '@/components/common/ErrorAlert';

export default function VersionsPage() {
  const { versions, loading, error, delete: deleteVersion } = useVersions();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta versão?')) return;

    try {
      setDeleteError(null);
      await deleteVersion(id);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erro ao deletar versão');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-heading">Versões</h1>
        <Link href="/versions/new" className="btn-primary">
          + Nova Versão
        </Link>
      </div>

      {error && <ErrorAlert message={error} />}
      {deleteError && <ErrorAlert message={deleteError} onClose={() => setDeleteError(null)} />}

      {loading ? <Loading /> : <VersionsTable versions={versions} onDelete={handleDelete} />}
    </div>
  );
}
