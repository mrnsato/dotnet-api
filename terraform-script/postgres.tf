# PostgreSQL Flexible Server
resource "azurerm_postgresql_flexible_server" "apimanager" {
  name                   = "apimanager-postgres-${random_string.db_suffix.result}"
  resource_group_name    = azurerm_resource_group.apimanager.name
  location              = azurerm_resource_group.apimanager.location
  version               = "16"
  administrator_login    = var.db_admin_username
  administrator_password = var.db_admin_password
  zone = 2
  storage_mb = 32768
  sku_name   = "B_Standard_B1ms"
  
  backup_retention_days        = 7
  geo_redundant_backup_enabled = false
  
  # NÃO incluir high_availability para Basic tier
  
  tags = {
    environment = "production"
    project     = "apimanager"
  }
  
  # Adicionar timeouts
  timeouts {
    create = "60m"
    update = "60m"
    read   = "10m"
    delete = "60m"
  }
  
  # ADICIONAR LIFECYCLE PARA IGNORAR ZONA
  lifecycle {
    ignore_changes = [
      zone,
      high_availability,
      tags
    ]
  }
}

# Random suffix para nome único
resource "random_string" "db_suffix" {
  length  = 8
  special = false
  upper   = false
}

# Database
resource "azurerm_postgresql_flexible_server_database" "apimanager" {
  name      = var.database_name
  server_id = azurerm_postgresql_flexible_server.apimanager.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}

# Firewall - Azure Services
resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_postgresql_flexible_server.apimanager.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

# Firewall - Acesso público (DESENVOLVIMENTO)
resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_all" {
  name             = "AllowAll"
  server_id        = azurerm_postgresql_flexible_server.apimanager.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "255.255.255.255"
}

# Configurações
resource "azurerm_postgresql_flexible_server_configuration" "require_secure_transport" {
  name      = "require_secure_transport"
  server_id = azurerm_postgresql_flexible_server.apimanager.id
  value     = "off"
}