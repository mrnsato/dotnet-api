# 📊 API Manager - Projeto Completo

Sistema completo de gerenciamento de **Tecnologias**, **Versões** e **Aplicações** com backend .NET, banco de dados PostgreSQL e frontend Next.js.

## 🏗️ Arquitetura do Projeto

```
dotnet-api/
├── src/                          # Backend .NET
│   ├── Program.cs               # Configuração principal
│   ├── appsettings.json         # Variáveis de ambiente
│   ├── Data/                    # Camada de dados
│   │   ├── AppDbContext.cs
│   │   └── Entities/
│   ├── Endpoints/               # Rotas da API
│   ├── Models/                  # DTOs
│   └── Properties/
├── database_scripts/             # Scripts SQL
│   ├── Create_Tables.sql
│   └── Create_Data.sql
├── frontend/                     # Frontend Next.js
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml           # Orquestração de containers
├── dotnet-api.csproj           # Projeto .NET
└── README.md                    # Esta documentação
```

---

## 🗄️ Banco de Dados

### 📋 Tabelas

#### **Technologies** (Tecnologias)
```sql
CREATE TABLE Technologies (
    Id INT PRIMARY KEY AUTOINCREMENT,
    Name VARCHAR(50) NOT NULL UNIQUE
);
```

#### **Versions** (Versões)
```sql
CREATE TABLE Versions (
    Id INT PRIMARY KEY AUTOINCREMENT,
    Name VARCHAR(50) NOT NULL,
    TechnologiesId INT NOT NULL FOREIGN KEY REFERENCES Technologies(Id),
    Standard BOOL,
    FullName VARCHAR(100) NOT NULL,
    EOS DATE,
    EOL DATE
);
```

#### **Applications** (Aplicações)
```sql
CREATE TABLE Applications (
    Id INT PRIMARY KEY AUTOINCREMENT,
    Name VARCHAR(50) NOT NULL,
    Active BOOL
);
```

#### **ApplicationVersions** (Relação)
```sql
CREATE TABLE ApplicationVersions (
    Id INT PRIMARY KEY AUTOINCREMENT,
    ApplicationId INT NOT NULL FOREIGN KEY REFERENCES Applications(Id),
    VersionId INT NOT NULL FOREIGN KEY REFERENCES Versions(Id)
);
```

### 📊 Diagrama de Relacionamentos

```
┌─────────────────┐         ┌──────────────┐         ┌──────────────────┐
│  Technologies   │─────────│   Versions   │─────────│   Applications   │
└─────────────────┘    1:N  └──────────────┘    N:N  └──────────────────┘
        │                            │
        │                            │
        │ Id                         │ Id
        │ Name              ┌────────┼────────┐
        │                   │        │        │
        └───────────────────┼────────┴────┐   │
                            │             │   │
                       ┌────────────────¬─────┴──────────────┐
                       │ ApplicationVersions                  │
                       │ ────────────────────────────────     │
                       │ Id                                   │
                       │ ApplicationId (FK)                   │
                       │ VersionId (FK)                       │
                       └──────────────────────────────────────┘
```

### 🗂️ Dados de Exemplo

```
Technologies:
├── 1: dotnet
├── 2: vakinha
└── 3: python

Versions:
├── 1: .NET 10.0.100 (Standard, EOS: 01/01/2026, EOL: 01/01/2026)
└── 2: vakinha yes

Applications:
├── 1: App 1 (Active: true)
└── 2: App 2 (Active: false)

ApplicationVersions:
└── 1: Application 1 + Version 1 (.NET 10.0.100)
```

---

## 🔧 Backend .NET

### 📋 Pré-requisitos

- **.NET 10.0+** instalado
- **PostgreSQL** rodando (ou Docker)
- **Git**

### 🚀 Como Rodar

#### 1. Clone o repositório
```bash
git clone <repo-url>
cd dotnet-api
```

#### 2. Configure o banco de dados
Edite `src/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=meubanco;Username=meuusuario;Password=senhasegura123"
  }
}
```

#### 3. Configure CORS (desenvolvimento)
O arquivo `src/Program.cs` já vem configurado para aceitar requisições de:
- `http://localhost:3000` (Frontend)
- `http://localhost:3001` (Frontend alternativo)

#### 4. Execute migrações e seed de dados
```bash
# Opcional: Criar tabelas
psql -U meuusuario -d meubanco -f database_scripts/Create_Tables.sql

# Opcional: Popular dados iniciais
psql -U meuusuario -d meubanco -f database_scripts/Create_Data.sql
```

#### 5. Inicie a API
```bash
dotnet run
```

A API estará disponível em: **http://localhost:5000**
Swagger: **http://localhost:5000/swagger**

### 🔌 Endpoints Disponíveis

#### **Technologies** (`/api/technology`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Listar todas as tecnologias |
| GET | `/{id}` | Buscar tecnologia por ID |
| POST | `/` | Criar nova tecnologia |
| PUT | `/{id}` | Atualizar tecnologia |
| DELETE | `/{id}` | Remover tecnologia |

#### **Versions** (`/api/versions`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Listar todas as versões |
| GET | `/{id}` | Buscar versão por ID |
| GET | `/technology/{technologyId}` | Versões de uma tecnologia |
| POST | `/` | Criar nova versão |
| PUT | `/{id}` | Atualizar versão |

#### **Applications** (`/api/applications`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Listar todas as aplicações |
| GET | `/{id}` | Buscar aplicação por ID |
| GET | `/active` | Listar aplicações ativas |
| POST | `/` | Criar nova aplicação |
| PUT | `/{id}` | Atualizar aplicação |
| DELETE | `/{id}` | Remover aplicação |

#### **ApplicationVersions** (`/api/application-versions`)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Listar todas as relações |
| GET | `/{id}` | Buscar relação por ID |
| GET | `/application/{appId}` | Versões de uma app |
| GET | `/version/{versionId}` | Apps que usam versão |
| POST | `/` | Criar relação |
| PUT | `/{id}` | Atualizar relação |
| DELETE | `/{id}` | Remover relação |

### 📨 Exemplos de Requisições

#### Criar Tecnologia
```bash
curl -X POST http://localhost:5000/api/technology \
  -H "Content-Type: application/json" \
  -d '{"name": "Node.js"}'
```

#### Criar Versão
```bash
curl -X POST http://localhost:5000/api/versions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "18.0",
    "technologiesId": 1,
    "standard": true,
    "fullName": "Node.js 18.0",
    "eos": "2026-04-30",
    "eol": "2028-04-30"
  }'
```

#### Criar Aplicação
```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -d '{"name": "Minha App", "active": true}'
```

---

## 🎨 Frontend Next.js

### 📋 Pré-requisitos

- **Node.js 18+** instalado
- **pnpm** ou **npm** ou **yarn**
- **API .NET rodando** em `http://localhost:5000`

### 🚀 Como Rodar

#### 1. Navegue até o frontend
```bash
cd frontend
```

#### 2. Instale as dependências
```bash
pnpm install
# ou
npm install
```

#### 3. Configure variáveis de ambiente
Crie ou edite `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

#### 4. Execute o servidor de desenvolvimento
```bash
pnpm run dev
```

Acesse em: **http://localhost:3000**

### 🏗️ Estrutura do Frontend

```
src/
├── app/                    # Páginas (Next.js App Router)
│   ├── page.tsx           # Dashboard
│   ├── layout.tsx         # Layout root
│   ├── globals.css        # Estilos globais
│   └── [recurso]/         # Pages dinâmicas
│
├── components/            # Componentes React
│   ├── common/           # Componentes base (Header, Loading, ErrorAlert)
│   ├── tables/           # Tabelas de dados
│   └── forms/            # Formulários validados
│
├── lib/                  # Utilitários e configs
│   ├── api.ts           # Cliente HTTP (axios)
│   ├── constants.ts     # Endpoints e constantes
│   └── utils.ts         # Funções auxiliares
│
├── services/            # Serviços HTTP
│   ├── technologyService.ts
│   ├── versionService.ts
│   ├── applicationService.ts
│   └── applicationVersionService.ts
│
├── hooks/               # Hooks customizados
│   ├── useTechnologies.ts
│   ├── useVersions.ts
│   ├── useApplications.ts
│   └── useApplicationVersions.ts
│
├── types/               # Type definitions
│   └── index.ts
│
└── schemas/             # Validações (Zod)
    ├── technology.schema.ts
    ├── version.schema.ts
    ├── application.schema.ts
    └── applicationVersion.schema.ts
```

### 🎯 Funcionalidades

✅ **Dashboard** - Página inicial com cards de navegação
✅ **CRUD Tecnologias** - Listar, criar, editar, deletar
✅ **CRUD Versões** - Com relação com tecnologias
✅ **CRUD Aplicações** - Com status ativo/inativo
✅ **Gerenciar Versões** - Associar versões a aplicações
✅ **Validações Zod** - Validação de formulários
✅ **Tratamento de Erros** - Mensagens de erro informativas
✅ **Loading States** - Spinners durante requisições
✅ **Responsivo** - UI com Tailwind CSS

### 📦 Stack Tecnológico

| Ferramenta | Versão | Uso |
|-----------|--------|-----|
| Next.js | 14.2.0 | Framework React |
| TypeScript | 5.6.0 | Type safety |
| React | 18.3.1 | UI biblioteca |
| Axios | 1.7.0 | HTTP client |
| React Hook Form | 7.52.0 | Gerenciamento de forms |
| Zod | 3.24.0 | Validação de schemas |
| Tailwind CSS | 3.4.13 | Styling |

### 🧪 Scripts Disponíveis

```bash
pnpm run dev      # Inicia servidor de desenvolvimento
pnpm run build    # Build otimizado para produção
pnpm start        # Serve aplicação compilada
pnpm run lint     # Verifica código com ESLint
```

---

## 🐳 Docker (Opcional)

### 📋 Arquivo docker-compose.yml

O projeto inclui um arquivo `docker-compose.yml` para orquestrar os containers:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:18
    environment:
      POSTGRES_USER: meuusuario
      POSTGRES_PASSWORD: senhasegura123
      POSTGRES_DB: meubanco
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      ConnectionStrings__DefaultConnection: "Host=postgres;Port=5432;Database=meubanco;Username=meuusuario;Password=senhasegura123"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_BASE_URL: http://api:5000
    depends_on:
      - api
```

### 🚀 Rodar com Docker

```bash
# Iniciar todos os containers
docker-compose up -d

# Parar todos os containers
docker-compose down

# Ver logs
docker-compose logs -f
```

---

## ✅ Checklist de Implementação

### Backend
- [x] Configurar .NET 10
- [x] Setup PostgreSQL
- [x] Criar entidades (Technology, Version, Application, ApplicationVersion)
- [x] Configurar DbContext
- [x] Implementar Endpoints (CRUD)
- [x] Configurar CORS
- [x] Swagger/OpenAPI
- [x] Validações básicas

### Banco de Dados
- [x] Criar tabelas
- [x] Definir relacionamentos
- [x] Seed de dados iniciais
- [x] Índices e constraints

### Frontend
- [x] Setup Next.js 14
- [x] TypeScript e Tailwind CSS
- [x] Estrutura de pastas
- [x] Cliente HTTP (axios)
- [x] Services e Hooks
- [x] Componentes reutilizáveis
- [x] Páginas CRUD
- [x] Validações (Zod)
- [x] Tratamento de erros
- [x] Loading states

---

## 🔐 Segurança

### ✅ Implementado

- CORS configurado para desenvolvimento
- TypeScript strict mode ativado
- Validação de entrada (Zod)
- Tratamento de erros sensível
- Sem exposição de dados sensíveis

### 🚀 Melhorias Futuras

- [ ] Autenticação JWT
- [ ] Rate limiting
- [ ] HTTPS em produção
- [ ] Variáveis de ambiente mais seguras
- [ ] Testes unitários
- [ ] E2E tests (Cypress/Playwright)

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'next/navigation'"
```bash
cd frontend
pnpm install
```

### Erro: "CORS policy blocked"
Certifique-se que:
1. API .NET está rodando em `http://localhost:5000`
2. CORS está configurado em `Program.cs`
3. Reinicie a API após alterações

### Erro: "Connection refused (PostgreSQL)"
```bash
# Verifique se PostgreSQL está rodando
psql -U meuusuario -d meubanco

# Ou use Docker
docker run -d -p 5432:5432 \
  -e POSTGRES_USER=meuusuario \
  -e POSTGRES_PASSWORD=senhasegura123 \
  -e POSTGRES_DB=meubanco \
  postgres:18
```

### Porta já em uso
```bash
# Mude a porta do frontend
pnpm run dev -- -p 3001

# Mude a porta da API no launchSettings.json
```

---

## 📚 Documentação Adicional

- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação .NET](https://learn.microsoft.com/pt-br/dotnet/)
- [Documentação PostgreSQL](https://www.postgresql.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

---

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido com ❤️

---

## 📞 Suporte

Para questões ou problemas, abra uma issue no repositório ou entre em contato.

---

**Última atualização**: Abril de 2026
