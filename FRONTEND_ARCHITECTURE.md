# Frontend Next.js - Documentação da Arquitetura

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura de Pastas](#estrutura-de-pastas)
3. [Endpoints da API](#endpoints-da-api)
4. [Arquitetura de Componentes](#arquitetura-de-componentes)
5. [Fluxos de Dados](#fluxos-de-dados)
6. [Guia de Implementação](#guia-de-implementação)

---

## 🎯 Visão Geral

Frontend desenvolvido em **Next.js 14+** com Typescript para gerenciar:
- **Tecnologias**: CRUD completo
- **Versões**: CRUD com relação com Tecnologias
- **Aplicações**: CRUD com status ativo/inativo
- **Relações Application-Versions**: Associar e gerenciar versões de aplicações

### Stack Tecnológico
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS (Styling)
- Axios (HTTP Client)
- React Hook Form (Forms)
- Context API (State Management)
- Zod (Validações)

---

## 📁 Estrutura de Pastas

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Layout root
│   │   ├── page.tsx                      # Dashboard
│   │   ├── technologies/
│   │   │   ├── page.tsx                  # Lista de tecnologias
│   │   │   ├── new/page.tsx              # Criar tecnologia
│   │   │   └── [id]/edit/page.tsx        # Editar tecnologia
│   │   ├── versions/
│   │   │   ├── page.tsx                  # Lista de versões
│   │   │   ├── new/page.tsx              # Criar versão
│   │   │   └── [id]/edit/page.tsx        # Editar versão
│   │   ├── applications/
│   │   │   ├── page.tsx                  # Lista de aplicações
│   │   │   ├── new/page.tsx              # Criar aplicação
│   │   │   ├── [id]/edit/page.tsx        # Editar aplicação
│   │   │   └── [id]/versions/page.tsx    # Gerenciar versões da app
│   │   └── globals.css                   # Estilos globais
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx                # Cabeçalho navegação
│   │   │   ├── Sidebar.tsx               # Menu lateral
│   │   │   ├── Loading.tsx               # Loader
│   │   │   └── ErrorAlert.tsx            # Alert de erros
│   │   ├── tables/
│   │   │   ├── TechnologiesTable.tsx     # Tabela de tecnologias
│   │   │   ├── VersionsTable.tsx         # Tabela de versões
│   │   │   ├── ApplicationsTable.tsx     # Tabela de aplicações
│   │   │   └── ApplicationVersionsTable.tsx # Tabela de relações
│   │   └── forms/
│   │       ├── TechnologyForm.tsx        # Form tecnologia
│   │       ├── VersionForm.tsx           # Form versão
│   │       ├── ApplicationForm.tsx       # Form aplicação
│   │       └── ApplicationVersionForm.tsx # Form relação
│   │
│   ├── lib/
│   │   ├── api.ts                        # Configuração axios
│   │   ├── constants.ts                  # URLs, constantes
│   │   └── utils.ts                      # Utilitários gerais
│   │
│   ├── services/
│   │   ├── technologyService.ts          # Service tecnologias
│   │   ├── versionService.ts             # Service versões
│   │   ├── applicationService.ts         # Service aplicações
│   │   └── applicationVersionService.ts  # Service relações
│   │
│   ├── hooks/
│   │   ├── useTechnologies.ts            # Hook tecnologias
│   │   ├── useVersions.ts                # Hook versões
│   │   ├── useApplications.ts            # Hook aplicações
│   │   └── useApplicationVersions.ts     # Hook relações
│   │
│   ├── context/
│   │   └── ApiContext.tsx                # Context para erros/loading
│   │
│   ├── types/
│   │   ├── index.ts                      # Tipos compartilhados
│   │   ├── technology.ts                 # Types tecnologia
│   │   ├── version.ts                    # Types versão
│   │   ├── application.ts                # Types aplicação
│   │   └── applicationVersion.ts         # Types relação
│   │
│   └── schemas/
│       ├── technology.schema.ts          # Validação Zod
│       ├── version.schema.ts             # Validação Zod
│       ├── application.schema.ts         # Validação Zod
│       └── applicationVersion.schema.ts  # Validação Zod
│
├── public/
│   └── images/                           # Imagens estáticas
│
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── postcss.config.js
```

---

## 🔌 Endpoints da API

### Base URL: `http://localhost:5000`

#### **TECHNOLOGIES**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/technology/` | Listar todas as tecnologias |
| GET | `/api/technology/{id}` | Buscar tecnologia por ID |
| POST | `/api/technology/` | Criar nova tecnologia |
| PUT | `/api/technology/{id}` | Atualizar tecnologia |
| DELETE | `/api/technology/{id}` | Remover tecnologia |

**Request/Response Technology:**
```typescript
{
  id: number;
  name: string;
}
```

#### **VERSIONS**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/versions/` | Listar todas as versões |
| GET | `/api/versions/{id}` | Buscar versão por ID |
| GET | `/api/versions/technology/{technologyId}` | Versões de uma tecnologia |
| POST | `/api/versions/` | Criar nova versão |
| PUT | `/api/versions/{id}` | Atualizar versão |

**Request/Response Version:**
```typescript
{
  id: number;
  name: string;
  technologiesId: number;
  technologyName?: string;
  standard: boolean;
  fullName: string;
  eos?: string | null;     // DateOnly
  eol?: string | null;     // DateOnly
}
```

#### **APPLICATIONS**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/applications/` | Listar todas as aplicações |
| GET | `/api/applications/{id}` | Buscar aplicação por ID |
| GET | `/api/applications/active` | Listar aplicações ativas |
| POST | `/api/applications/` | Criar nova aplicação |
| PUT | `/api/applications/{id}` | Atualizar aplicação |
| DELETE | `/api/applications/{id}` | Remover aplicação |

**Request/Response Application:**
```typescript
{
  id: number;
  name: string;
  active: boolean;
}
```

#### **APPLICATION-VERSIONS**
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/application-versions/` | Listar todas as relações |
| GET | `/api/application-versions/{id}` | Buscar relação por ID |
| GET | `/api/application-versions/application/{appId}` | Versões de uma app |
| GET | `/api/application-versions/version/{versionId}` | Apps que usam versão |
| POST | `/api/application-versions/` | Criar relação |
| PUT | `/api/application-versions/{id}` | Atualizar relação |

**Request/Response ApplicationVersion:**
```typescript
{
  id: number;
  applicationId: number;
  versionId: number;
  applicationName?: string;
  versionName?: string;
}
```

---

## 🏗️ Arquitetura de Componentes

### Camadas

#### 1. **API Layer** (`lib/api.ts`)
- Configuração centralizada do axios
- Interceptadores para tratamento de erros
- Base URL dinâmica

#### 2. **Services** (`services/`)
- Encapsula chamadas HTTP
- Tipagem completa de requisições/respostas
- Tratamento básico de erros

#### 3. **Hooks** (`hooks/`)
- Gerencia estado local (loading, erros, dados)
- Refetch e mutações
- Integração com React Query (opcional)

#### 4. **Context** (`context/`)
- Estado global (erros, notificações)
- Provider root

#### 5. **Components** (`components/`)
- Componentes apresentacionais reutilizáveis
- Forms validados com React Hook Form + Zod
- Tabelas com ações (edit, delete)

#### 6. **Pages** (`app/`)
- Páginas do Next.js
- Composição de componentes
- Roteamento dinâmico

---

## 🔄 Fluxos de Dados

### Fluxo Padrão de CRUD

```
Page Component
    ↓
useHook (ex: useTechnologies)
    ↓
Service (ex: technologyService)
    ↓
API (axios)
    ↓
Backend (.NET)
    ↓
Resposta → Service → Hook (setState) → Component (rerender)
```

### Exemplo: Listar Tecnologias
```
1. Página technologies/page.tsx carrega
2. useEffect chama useTechnologies()
3. Hook chama technologyService.list()
4. Service faz GET /api/technology/
5. Dados retornam e atualizam estado
6. Component renderiza TechnologiesTable com dados
```

### Exemplo: Criar Tecnologia
```
1. Usuário acessa /technologies/new
2. Renderiza TechnologyForm
3. Form valida com Zod ao submit
4. Envia POST /api/technology/
5. Sucesso → redirect para /technologies
6. Erro → exibe mensagem de erro
```

---

## 📦 Type Definitions

### Technology
```typescript
interface Technology {
  id: number;
  name: string;
}
```

### Version
```typescript
interface Version {
  id: number;
  name: string;
  technologiesId: number;
  technologyName?: string;
  standard: boolean;
  fullName: string;
  eos?: string | null;
  eol?: string | null;
}
```

### Application
```typescript
interface Application {
  id: number;
  name: string;
  active: boolean;
}
```

### ApplicationVersion
```typescript
interface ApplicationVersion {
  id: number;
  applicationId: number;
  versionId: number;
  applicationName?: string;
  versionName?: string;
}
```

---

## ✅ Validações (Zod Schemas)

### Technology
- `name`: string, min 1, max 50

### Version
- `name`: string, min 1, max 50
- `technologiesId`: number, greater than 0
- `standard`: boolean
- `fullName`: string, min 1
- `eos`: date | null
- `eol`: date | null

### Application
- `name`: string, min 1, max 100
- `active`: boolean

### ApplicationVersion
- `applicationId`: number, greater than 0
- `versionId`: number, greater than 0

---

## 🚀 Dependências

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "next": "^14.2.0",
    "axios": "^1.7.0",
    "react-hook-form": "^7.52.0",
    "zod": "^3.24.0",
    "@hookform/resolvers": "^3.4.0",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "tailwindcss": "^3.4.13",
    "postcss": "^8.4.47",
    "autoprefixer": "^10.4.20"
  }
}
```

---

## 🔐 Considerações de Segurança

- [ ] Variáveis de ambiente para API_BASE_URL
- [ ] CORS configurado no backend
- [ ] Validação de entrada (Zod)
- [ ] Tratamento de erros sensíveis
- [ ] Rate limiting (opcional)
- [ ] Autenticação JWT (futuro)

---

## 📝 Checklist de Implementação

- [ ] Setup Next.js project
- [ ] Instalar dependências
- [ ] Configurar Tailwind CSS
- [ ] Criar estrutura de pastas
- [ ] Implementar API client (axios)
- [ ] Criar types e schemas
- [ ] Implementar services
- [ ] Criar hooks customizados
- [ ] Implementar componentes base
- [ ] Criar páginas de listagem
- [ ] Criar páginas de CRUD
- [ ] Testar integração com API
- [ ] Implementar tratamento de erros
- [ ] Deploy

---

## 🧪 Testes Sugeridos

1. **Unit Tests**: Services e Hooks
2. **Integration Tests**: Componentes com API mock
3. **E2E Tests**: Fluxos completos (Cypress/Playwright)

---

