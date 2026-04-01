'use client';

import Link from 'next/link';
import { Version } from '@/types';
import { formatDate } from '@/lib/utils';

interface VersionsTableProps {
  versions: Version[];
  onDelete: (id: number) => void;
  loading?: boolean;
}

export const VersionsTable = ({ versions, onDelete, loading = false }: VersionsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Tecnologia</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Nome Completo</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Padrão</th>
            <th className="border border-gray-300 px-4 py-2 text-left">EOS</th>
            <th className="border border-gray-300 px-4 py-2 text-left">EOL</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {versions.map((version) => (
            <tr key={version.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{version.id}</td>
              <td className="border border-gray-300 px-4 py-2">{version.technologyName}</td>
              <td className="border border-gray-300 px-4 py-2">{version.fullName}</td>
              <td className="border border-gray-300 px-4 py-2">{version.standard ? '✓' : ''}</td>
              <td className="border border-gray-300 px-4 py-2">{formatDate(version.eos)}</td>
              <td className="border border-gray-300 px-4 py-2">{formatDate(version.eol)}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <Link
                  href={`/versions/${version.id}/edit`}
                  className="bg-primary text-white px-3 py-1 rounded mr-2 hover:opacity-80"
                >
                  Editar
                </Link>
                <button
                  onClick={() => onDelete(version.id)}
                  disabled={loading}
                  className="bg-danger text-white px-3 py-1 rounded hover:opacity-80 disabled:opacity-50"
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {versions.length === 0 && (
        <p className="text-center py-4 text-gray-500">Nenhuma versão encontrada</p>
      )}
    </div>
  );
};
