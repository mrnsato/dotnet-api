'use client';

import Link from 'next/link';

export const Header = () => {
  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          📊 API Manager
        </Link>
        <nav className="flex gap-8">
          <Link href="/technologies" className="hover:opacity-80 transition">
            Tecnologias
          </Link>
          <Link href="/versions" className="hover:opacity-80 transition">
            Versões
          </Link>
          <Link href="/applications" className="hover:opacity-80 transition">
            Aplicações
          </Link>
        </nav>
      </div>
    </header>
  );
};
