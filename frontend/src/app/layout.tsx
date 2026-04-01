import type { Metadata } from 'next';
import { Header } from '@/components/common/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'API Manager - Gerenciador de Aplicações',
  description: 'Plataforma para gerenciar tecnologias, versões e aplicações',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main className="container py-8">{children}</main>
      </body>
    </html>
  );
}
