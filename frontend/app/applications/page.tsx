"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

type Application = {
  id: number;
  name: string;
  active: boolean;
};

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    api.get("/applications").then(res => setApps(res.data as Application[]));
  }, []);

  const deleteApp = async (id: number) => {
    await api.delete(`/applications/${id}`);
    setApps(apps.filter(a => a.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Applications</h1>
      <Button asChild>
        <a href="/applications/new">Nova aplicação</a>
      </Button>
      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">ID</th>
            <th className="p-2">Nome</th>
            <th className="p-2">Ativo</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {apps.map(app => (
            <tr key={app.id} className="border-t">
              <td className="p-2">{app.id}</td>
              <td className="p-2">{app.name}</td>
              <td className="p-2">{app.active ? "✅" : "❌"}</td>
              <td className="p-2 flex gap-2">
                <Button asChild variant="outline">
                  <a href={`/applications/${app.id}/edit`}>Editar</a>
                </Button>
                <Button variant="destructive" onClick={() => deleteApp(app.id)}>
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
