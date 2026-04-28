#!/bin/bash

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Setup do Banco de Dados PostgreSQL  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Obter informações do Terraform
echo -e "${YELLOW}[1/5] Obtendo informações do banco...${NC}"
DB_HOST=$(terraform output -raw postgres_server_fqdn 2>/dev/null || echo "apimanager-postgres-oq9yg4ds.postgres.database.azure.com")
DB_NAME=$(terraform output -raw database_name 2>/dev/null || echo "apimanager_db")
DB_USER=$(terraform output -raw database_admin_username 2>/dev/null || echo "apimanager_admin")

echo "  Host: $DB_HOST"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Solicitar senha
read -sp "🔐 Digite a senha do banco: " DB_PASSWORD
echo ""
echo ""

# Testar conexão
echo -e "${YELLOW}[2/5] Testando conexão...${NC}"
if PGPASSWORD="$DB_PASSWORD" psql \
    -h "$DB_HOST" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -c "SELECT version();" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Conexão bem-sucedida!${NC}"
else
    echo -e "${RED}✗ Falha na conexão!${NC}"
    echo "Verifique as credenciais e tente novamente."
    exit 1
fi
echo ""

# Criar arquivo SQL
echo -e "${YELLOW}[3/5] Criando script SQL...${NC}"
cat > create-tables.sql << 'EOF'
-- ============================================
-- API Manager Database Schema
-- ============================================

-- Criação da tabela technologies
CREATE TABLE IF NOT EXISTS technologies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela versions
CREATE TABLE IF NOT EXISTS versions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    technologies_id INT REFERENCES technologies(id) ON DELETE CASCADE,
    standard BOOLEAN DEFAULT false,
    full_name VARCHAR(100) NOT NULL,
    eos DATE,
    eol DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(technologies_id, name)
);

-- Criação da tabela applications
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de associação applications_versions
CREATE TABLE IF NOT EXISTS applications_versions (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    version_id INT REFERENCES versions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(application_id, version_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_versions_technologies_id ON versions(technologies_id);
CREATE INDEX IF NOT EXISTS idx_versions_standard ON versions(standard);
CREATE INDEX IF NOT EXISTS idx_applications_active ON applications(active);
CREATE INDEX IF NOT EXISTS idx_app_versions_application_id ON applications_versions(application_id);
CREATE INDEX IF NOT EXISTS idx_app_versions_version_id ON applications_versions(version_id);

-- Comentários nas tabelas
COMMENT ON TABLE technologies IS 'Armazena as tecnologias disponíveis';
COMMENT ON TABLE versions IS 'Armazena as versões de cada tecnologia';
COMMENT ON TABLE applications IS 'Armazena as aplicações';
COMMENT ON TABLE applications_versions IS 'Relacionamento entre aplicações e versões';

-- Verificação
SELECT 'Tabelas criadas com sucesso!' AS status;
EOF

echo -e "${GREEN}✓ Script criado${NC}"
echo ""

# Executar script
echo -e "${YELLOW}[4/5] Executando script SQL...${NC}"
PGPASSWORD="$DB_PASSWORD" psql \
    -h "$DB_HOST" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -f create-tables.sql

echo -e "${GREEN}✓ Script executado${NC}"
echo ""

# Verificar tabelas criadas
echo -e "${YELLOW}[5/5] Verificando tabelas criadas...${NC}"
PGPASSWORD="$DB_PASSWORD" psql \
    -h "$DB_HOST" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     Setup Concluído com Sucesso! ✓    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# Mostrar estrutura das tabelas
echo -e "${BLUE}📊 Estrutura das Tabelas:${NC}"
echo ""

for table in technologies versions applications applications_versions; do
    echo -e "${YELLOW}Tabela: $table${NC}"
    PGPASSWORD="$DB_PASSWORD" psql \
        -h "$DB_HOST" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        -c "\d $table" 2>/dev/null || echo "Tabela não encontrada"
    echo ""
done

# Connection string para a aplicação
echo -e "${BLUE}🔗 Connection String para sua aplicação .NET:${NC}"
echo "Host=$DB_HOST;Database=$DB_NAME;Username=$DB_USER;Password=***;Port=5432;SSL Mode=Require;Trust Server Certificate=true;"
echo ""

# Limpar arquivo temporário
rm -f create-tables.sql