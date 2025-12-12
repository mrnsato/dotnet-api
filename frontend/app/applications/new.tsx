"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function NewApplicationPage() {
  const [name, setName] = useState("");
  const [active, setActive] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/applications", { name, active });
    window.location.href = "/applications";
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Nova aplicação</h1>
      <Input
        placeholder="Nome da aplicação"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <Checkbox checked={active} onCheckedChange={(val) => setActive(!!val)} />
        <span>Ativo</span>
      </div>
      <Button type="submit">Salvar</Button>
    </form>
  );
}
