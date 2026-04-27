/** @type {import('next').NextConfig} */
const nextConfig = {
  // ⚠️ IMPORTANTE: Habilitar standalone
  output: 'standalone',
  
  // Configuração da API
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://dotnet_api:8080/api',
  },

  // Desabilitar telemetria
  experimental: {
    outputFileTracingRoot: undefined,
  },
};

console.log('Configuração do Next.js:', process.env.NEXT_PUBLIC_API_URL);
module.exports = nextConfig;