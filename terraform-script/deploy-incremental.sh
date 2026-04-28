#!/bin/bash

set -e

# Configurações
export TF_LOG=ERROR
export ARM_CLIENT_TIMEOUT=180
RETRY_DELAY=45

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Deploy Incremental - API Manager    ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo ""

# Função de retry para comandos
retry_apply() {
    local target=$1
    local max_attempts=3
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        echo -e "${YELLOW}→ Aplicando: $target (tentativa $attempt/$max_attempts)${NC}"
        
        if terraform apply -target="$target" -parallelism=1 -auto-approve; then
            echo -e "${GREEN}✓ $target aplicado com sucesso${NC}"
            return 0
        else
            if [ $attempt -lt $max_attempts ]; then
                echo -e "${RED}✗ Falha. Aguardando ${RETRY_DELAY}s...${NC}"
                sleep $RETRY_DELAY
                terraform refresh 2>/dev/null || true
            fi
            attempt=$((attempt + 1))
        fi
    done
    
    echo -e "${RED}✗ Falha ao aplicar $target após $max_attempts tentativas${NC}"
    return 1
}

# Verificar autenticação
echo -e "${BLUE}[1/12] Verificando autenticação Azure...${NC}"
if ! az account show &>/dev/null; then
    echo -e "${RED}✗ Não autenticado. Execute: az login${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Autenticado${NC}"
echo ""

# Inicializar Terraform
echo -e "${BLUE}[2/12] Inicializando Terraform...${NC}"
terraform init -upgrade=false
echo -e "${GREEN}✓ Terraform inicializado${NC}"
echo ""

# Validar
echo -e "${BLUE}[3/12] Validando configuração...${NC}"
terraform validate
echo -e "${GREEN}✓ Configuração válida${NC}"
echo ""

# Lista de recursos na ordem correta
RESOURCES=(
    "random_string.db_suffix"
    "azurerm_resource_group.apimanager"
    "azurerm_container_registry.apimanager"
    "azurerm_container_app_environment.apimanager"
    "azurerm_postgresql_flexible_server.apimanager"
    "azurerm_postgresql_flexible_server_database.apimanager"
    "azurerm_postgresql_flexible_server_firewall_rule.allow_azure_services"
    "azurerm_postgresql_flexible_server_firewall_rule.allow_all"
    "azurerm_postgresql_flexible_server_configuration.require_secure_transport"
    "azurerm_service_plan.apimanager"
    "azurerm_linux_web_app.apimanager"
)

# Aplicar cada recurso
echo -e "${BLUE}[4/12] Aplicando recursos...${NC}"
echo ""

for resource in "${RESOURCES[@]}"; do
    # Verificar se já existe no state
    if terraform state show "$resource" &>/dev/null; then
        echo -e "${GREEN}✓ $resource já existe no state${NC}"
    else
        retry_apply "$resource" || {
            echo -e "${YELLOW}⚠ Continuando apesar do erro em $resource${NC}"
        }
    fi
    sleep 10
    echo ""
done

# Aplicar recursos restantes
echo -e "${BLUE}[5/12] Aplicando recursos restantes...${NC}"
if terraform apply -parallelism=1 -auto-approve; then
    echo -e "${GREEN}✓ Todos os recursos aplicados${NC}"
else
    echo -e "${YELLOW}⚠ Alguns recursos podem ter falhado${NC}"
fi
echo ""

# Refresh final
echo -e "${BLUE}[6/12] Atualizando state final...${NC}"
terraform refresh
echo ""

# Mostrar outputs
echo -e "${BLUE}[7/12] Outputs:${NC}"
terraform output
echo ""

# Resumo
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         Deploy Concluído! ✓            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# Mostrar recursos criados
echo -e "${BLUE}Recursos criados:${NC}"
terraform state list
echo ""

# Informações de conexão
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}📊 INFORMAÇÕES DE CONEXÃO${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"

if terraform output postgres_server_fqdn &>/dev/null; then
    echo -e "${YELLOW}PostgreSQL:${NC}"
    echo "  Host: $(terraform output -raw postgres_server_fqdn 2>/dev/null || echo 'N/A')"
    echo "  Database: apimanager_db"
    echo "  Username: apimanager_admin"
    echo "  Port: 5432"
    echo ""
fi

if terraform output webapp_url &>/dev/null; then
    echo -e "${YELLOW}Web App:${NC}"
    echo "  URL: $(terraform output -raw webapp_url 2>/dev/null || echo 'N/A')"
    echo ""
fi

if terraform output acr_login_server &>/dev/null; then
    echo -e "${YELLOW}Container Registry:${NC}"
    echo "  Server: $(terraform output -raw acr_login_server 2>/dev/null || echo 'N/A')"
    echo ""
fi

echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"