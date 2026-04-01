'use client';

import Link from 'next/link';
import { Application } from '@/types';

interface ApplicationsTableProps {
  applications: Application[];
  onDelete: (id: number) => void;
  loading?: boolean;
}

export const ApplicationsTable = ({ applications, onDelete, loading = false }: ApplicationsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Nome</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{app.id}</td>
              <td className="border border-gray-300 px-4 py-2">{app.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                <span className={`px-3 py-1 rounded text-white ${app.active ? 'bg-secondary' : 'bg-gray-400'}`}>
                  {app.active ? 'Ativa' : 'Inativa'}
                </span>
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                <Link
                  href={`/applications/${app.id}/edit`}
                  className="bg-primary text-white px-3 py-1 rounded mr-2 hover:opacity-80"
                >
                  Editar
                </Link>
                <Link
                  href={`/applications/${app.id}/versions`}
                  className="bg-warning text-white px-3 py-1 rounded mr-2 hover:opacity-80"
                >
                  Versões
                </Link>
                <button
                  onClick={() => onDelete(app.id)}
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
      {applications.length === 0 && (
        <p className="text-center py-4 text-gray-500">Nenhuma aplicação encontrada</p>
      )}
    </div>
  );
};
