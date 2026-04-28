#!/bin/bash

set -e

echo "🔧 Script de Recovery do Terraform State"
echo "=========================================="

SUBSCRIPTION_ID="5216bee2-e062-4213-bc95-99b40fa27795"
RESOURCE_GROUP="arch-coe-apimanager-rg"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar se recurso existe
check_resource() {
    local resource_name=$1
    echo -e "${YELLOW}Verificando $resource_name...${NC}"
    az resource show --ids "$resource_name" &> /dev/null
    return $?
}

# Função para importar recurso
import_resource() {
    local tf_resource=$1
    local azure_id=$2
    
    echo -e "${YELLOW}Importando $tf_resource...${NC}"
    
    if terraform state show "$tf_resource" &> /dev/null; then
        echo -e "${GREEN}✓ $tf_resource já existe no state${NC}"
    else
        terraform import "$tf_resource" "$azure_id"
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ $tf_resource importado com sucesso${NC}"
        else
            echo -e "${RED}✗ Falha ao importar $tf_resource${NC}"
        fi
    fi
}

echo ""
echo "1️⃣  Verificando autenticação Azure..."
az account show &> /dev/null || az login

echo ""
echo "2️⃣  Listando recursos no Azure..."
az resource list --resource-group "$RESOURCE_GROUP" --output table

echo ""
echo "3️⃣  Importando recursos para o Terraform..."

# Resource Group
import_resource \
    "azurerm_resource_group.apimanager" \
    "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP"

# Container Registry
ACR_ID="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.ContainerRegistry/registries/apimanageracr"
if check_resource "$ACR_ID"; then
    import_resource "azurerm_container_registry.apimanager" "$ACR_ID"
fi

# Container App Environment
ENV_ID="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.App/managedEnvironments/apimanager-container-env"
if check_resource "$ENV_ID"; then
    import_resource "azurerm_container_app_environment.apimanager" "$ENV_ID"
fi

# PostgreSQL (se existir)
POSTGRES_SERVERS=$(az postgres flexible-server list --resource-group "$RESOURCE_GROUP" --query "[].name" -o tsv)
if [ ! -z "$POSTGRES_SERVERS" ]; then
    for server in $POSTGRES_SERVERS; do
        echo -e "${YELLOW}Encontrado PostgreSQL: $server${NC}"
        PG_ID="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.DBforPostgreSQL/flexibleServers/$server"
        import_resource "azurerm_postgresql_flexible_server.apimanager" "$PG_ID"
    done
fi

# Service Plan
PLANS=$(az appservice plan list --resource-group "$RESOURCE_GROUP" --query "[].name" -o tsv)
if [ ! -z "$PLANS" ]; then
    for plan in $PLANS; do
        echo -e "${YELLOW}Encontrado Service Plan: $plan${NC}"
        PLAN_ID="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/serverfarms/$plan"
        import_resource "azurerm_service_plan.apimanager" "$PLAN_ID"
    done
fi

# Web App
WEBAPPS=$(az webapp list --resource-group "$RESOURCE_GROUP" --query "[].name" -o tsv)
if [ ! -z "$WEBAPPS" ]; then
    for webapp in $WEBAPPS; do
        echo -e "${YELLOW}Encontrado Web App: $webapp${NC}"
        WEBAPP_ID="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$webapp"
        import_resource "azurerm_linux_web_app.apimanager" "$WEBAPP_ID"
    done
fi

echo ""
echo "4️⃣  Verificando estado do Terraform..."
terraform state list

echo ""
echo "5️⃣  Atualizando state com Azure..."
terraform refresh

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Recovery concluído!"
echo "==========================================${NC}"
echo ""
echo "Próximos passos:"
echo "1. Execute: terraform plan"
echo "2. Se estiver tudo OK: terraform apply"