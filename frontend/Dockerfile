# Etapa 1: Dependências
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install
RUN npm ci --only=production

# Etapa 2: Build
FROM node:24-alpine AS builder
WORKDIR /app

# Copiar dependências
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variáveis de ambiente
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Debug: Listar arquivos antes do build
RUN echo "📁 Arquivos antes do build:" && ls -la

# Build
RUN npm run build

# Debug: Verificar o que foi gerado
RUN echo "📦 Arquivos após build:" && \
    ls -la .next/ && \
    echo "📁 Conteúdo de .next/standalone:" && \
    ls -la .next/standalone/ || echo "⚠️ standalone não existe" && \
    echo "📁 Conteúdo de public:" && \
    ls -la public/ || echo "⚠️ public não existe"

# Etapa 3: Runner
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copiar static
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar public se existir
RUN mkdir -p ./public
COPY --from=builder --chown=nextjs:nodejs /app/public ./public || true

# Verificar estrutura final
RUN echo "📂 Estrutura final:" && ls -la

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]