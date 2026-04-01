'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useVersions } from '@/hooks/useVersions';
import { useApplicationVersions } from '@/hooks/useApplicationVersions';
import { applicationVersionService } from '@/services/applicationVersionService';
import { ApplicationVersionsTable } from '@/components/tables/ApplicationVersionsTable';
import { Loading } from '@/components/common/Loading';
import { ErrorAlert } from '@/components/common/ErrorAlert';

export default function ApplicationVersionsPage() {
  const params = useParams();
  const appId = Number(params.id);
  const { versions, loading: versionLoading } = useVersions();
  const [appVersions, setAppVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<string>('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        setLoading(true);
        const data = await applicationVersionService.getByApplication(appId);
        setAppVersions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar versões');
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [appId]);

  const handleAddVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVersionId) return;

    try {
      setDeleteError(null);
      await applicationVersionService.create({
        applicationId: appId,
        versionId: Number(selectedVersionId),
      });
      const data = await applicationVersionService.getByApplication(appId);
      setAppVersions(data);
      setSelectedVersionId('');
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erro ao adicionar versão');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja remover esta versão?')) return;

    try {
      setDeleteError(null);
      await applicationVersionService.delete(id);
      setAppVersions(appVersions.filter((av) => av.id !== id));
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Erro ao remover versão');
    }
  };

  if (loading || versionLoading) return <Loading />;

  return (
    <div>
      <div className="mb-6">
        <Link href="/applications" className="text-primary hover:underline">
          ← Voltar
        </Link>
        <h1 className="text-heading mt-4">Versões da Aplicação</h1>
      </div>

      {error && <ErrorAlert message={error} />}
      {deleteError && <ErrorAlert message={deleteError} onClose={() => setDeleteError(null)} />}

      <div className="card mb-6">
        <h2 className="text-lg font-bold mb-4">Adicionar Versão</h2>
        <form onSubmit={handleAddVersion} className="flex gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="versionId" className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Versão
            </label>
            <select
              id="versionId"
              value={selectedVersionId}
              onChange={(e) => setSelectedVersionId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">-- Selecione uma versão --</option>
              {versions.map((version) => (
                <option key={version.id} value={version.id}>
                  {version.fullName}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary">
            Adicionar
          </button>
        </form>
      </div>

      <h2 className="text-lg font-bold mb-4">Versões Associadas</h2>
      <ApplicationVersionsTable applicationVersions={appVersions} onDelete={handleDelete} />
    </div>
  );
}
