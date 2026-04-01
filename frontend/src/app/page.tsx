'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Bem-vindo ao API Manager</h1>
        <p className="text-lg text-gray-600 mb-8">Gerenciador completo de tecnologias, versões e aplicações</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Link href="/technologies" className="card hover:shadow-lg transition">
            <div className="text-4xl mb-4">🔧</div>
            <h2 className="text-xl font-bold mb-2">Tecnologias</h2>
            <p className="text-gray-600">Gerencie todas as tecnologias utilizadas</p>
          </Link>

          <Link href="/versions" className="card hover:shadow-lg transition">
            <div className="text-4xl mb-4">📦</div>
            <h2 className="text-xl font-bold mb-2">Versões</h2>
            <p className="text-gray-600">Controle as versões de cada tecnologia</p>
          </Link>

          <Link href="/applications" className="card hover:shadow-lg transition">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-xl font-bold mb-2">Aplicações</h2>
            <p className="text-gray-600">Administre suas aplicações e suas versões</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
