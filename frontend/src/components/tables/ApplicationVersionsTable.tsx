'use client';

import { ApplicationVersion } from '@/types';

interface ApplicationVersionsTableProps {
  applicationVersions: ApplicationVersion[];
  onDelete: (id: number) => void;
  loading?: boolean;
}

export const ApplicationVersionsTable = ({
  applicationVersions,
  onDelete,
  loading = false,
}: ApplicationVersionsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Aplicação</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Versão</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {applicationVersions.map((appVersion) => (
            <tr key={appVersion.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{appVersion.id}</td>
              <td className="border border-gray-300 px-4 py-2">{appVersion.applicationName}</td>
              <td className="border border-gray-300 px-4 py-2">{appVersion.versionName}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <button
                  onClick={() => onDelete(appVersion.id)}
                  disabled={loading}
                  className="bg-danger text-white px-3 py-1 rounded hover:opacity-80 disabled:opacity-50"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {applicationVersions.length === 0 && (
        <p className="text-center py-4 text-gray-500">Nenhuma versão associada</p>
      )}
    </div>
  );
};
