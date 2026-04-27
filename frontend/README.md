# Frontend Next.js - API Manager

Um frontend moderno em **Next.js** para gerenciar Tecnologias, Versões e Aplicações.

## 🚀 Iniciar o Projeto

### Pré-requisitos
- Node.js 18+ instalado
- API .NET rodando em `http://localhost:8080`

### Instalação

```bash
cd frontend
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse em: **http://localhost:3000**

### Build para Produção

```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
src/
├── app/              # Páginas Next.js (App Router)
├── components/       # Componentes React reutilizáveis
├── lib/              # Utilitários e configurações
├── services/         # Serviços HTTP
├── hooks/            # Hooks customizados
├── types/            # Type definitions
├── schemas/          # Validações Zod
└── context/          # Context API
```

## 🔌 Endpoints Integrados

### Tecnologias
- `GET /api/technology/` - Listar
- `GET /api/technology/{id}` - Por ID
- `POST /api/technology/` - Criar
- `PUT /api/technology/{id}` - Atualizar
- `DELETE /api/technology/{id}` - Deletar

### Versões
- `GET /api/versions/` - Listar
- `GET /api/versions/{id}` - Por ID
- `GET /api/versions/technology/{tech}` - Por Tecnologia
- `POST /api/versions/` - Criar
- `PUT /api/versions/{id}` - Atualizar

### Aplicações
- `GET /api/applications/` - Listar
- `GET /api/applications/{id}` - Por ID
- `GET /api/applications/active` - Ativas
- `POST /api/applications/` - Criar
- `PUT /api/applications/{id}` - Atualizar
- `DELETE /api/applications/{id}` - Deletar

### Application Versions
- `GET /api/application-versions/` - Listar
- `GET /api/application-versions/application/{appId}` - Por App
- `GET /api/application-versions/version/{versionId}` - Por Versão
- `POST /api/application-versions/` - Criar
- `DELETE /api/application-versions/{id}` - Deletar

## 📦 Dependências Principais

- **Next.js** - Framework React com SSR
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de dados
- **Tailwind CSS** - Styling

## 🎨 Variáveis de Ambiente

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## 🧪 Testando os Endpoints

1. Acesse **http://localhost:3000**
2. Navegue entre as seções:
   - **Tecnologias** - CRUD completo
   - **Versões** - Criar/Editar vinculadas a tecnologias
   - **Aplicações** - Gerenciar apps e suas versões
3. Clique em "Versões" em uma aplicação para associar versões

## 🔒 Validações Implementadas

- Campos obrigatórios
- Limites de caracteres
- Seleção de relacionamentos
- Datas válidas (EOS/EOL)
- Tratamento de erros completo

## 🚨 Troubleshooting

### Erro de conexão com API
- Verifique se a API .NET está rodando em `http://localhost:8080`
- Verifique CORS no backend

### Porta 3000 já em uso
```bash
npm run dev -- -p 3001
```

### Limpar cache
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build otimizado
- `npm start` - Serve a aplicação compilada
- `npm run lint` - Verifica código

## 🤝 Integração com Backend

Todos os tipos TypeScript e schemas Zod foram criados para bater fielmente com os DTOs da API .NET, garantindo type-safety completo.

---

**Desenvolvido com ❤️ para gerenciar sua API**
