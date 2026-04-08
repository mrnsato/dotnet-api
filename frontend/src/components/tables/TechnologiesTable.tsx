'use client';
import Link from 'next/link';
import { Technology } from '@/types';

interface TechnologiesTableProps {
  technologies: Technology[];
  onDelete: (id: number) => void;
  loading?: boolean;
  deleteError?: string | null;        // 👈 novo
  onClearDeleteError?: () => void;    // 👈 novo
}

export const TechnologiesTable = ({
  technologies,
  onDelete,
  loading = false,
  deleteError,                        // 👈 novo
  onClearDeleteError,                 // 👈 novo
}: TechnologiesTableProps) => {
  return (
    <div>
      {/* 👇 Alerta de erro de exclusão */}
      {deleteError && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 p-4">
          <span className="text-red-500 text-lg">⚠️</span>
          <div className="flex-1">
            <p className="font-medium text-red-700">Não foi possível excluir</p>
            <p className="mt-1 text-sm text-red-600">{deleteError}</p>
          </div>
          <button
            onClick={onClearDeleteError}
            className="font-bold text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Nome</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {technologies.map((tech) => (
              <tr key={tech.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{tech.id}</td>
                <td className="border border-gray-300 px-4 py-2">{tech.name}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <Link
                    href={`/technologies/${tech.id}/edit`}
                    className="bg-primary text-white px-3 py-1 rounded mr-2 hover:opacity-80"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => onDelete(tech.id)}
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

        {technologies.length === 0 && (
          <p className="text-center py-4 text-gray-500">Nenhuma tecnologia encontrada</p>
        )}
      </div>
    </div>
  );
};

