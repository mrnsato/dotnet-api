# App Service Plan
resource "azurerm_service_plan" "apimanager" {
  name                = "apimanager-service-plan"
  location            = azurerm_resource_group.apimanager.location
  resource_group_name = azurerm_resource_group.apimanager.name
  os_type             = "Linux"
  sku_name            = "B1"  # Mudei de F1 para B1 para melhor performance
  
  tags = {
    environment = "production"
    project     = "apimanager"
  }
}
  
# App Service (Web App) para API
resource "azurerm_linux_web_app" "apimanager" {
  name                = "apimanager-api-webapp"
  location            = azurerm_resource_group.apimanager.location
  resource_group_name = azurerm_resource_group.apimanager.name
  service_plan_id     = azurerm_service_plan.apimanager.id
  https_only          = true
  
  site_config {
    always_on = true  # Mudei para true com B1
  
    application_stack {
      docker_image_name        = var.docker_image_name
      docker_registry_url      = "https://${azurerm_container_registry.apimanager.login_server}"
      docker_registry_username = azurerm_container_registry.apimanager.admin_username
      docker_registry_password = azurerm_container_registry.apimanager.admin_password
    }
    
    cors {
      allowed_origins = ["*"]  # Ajustar conforme necessário
    }
  }
  
  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "DOCKER_ENABLE_CI"                    = "true"
    
    # Database Connection
    "DATABASE_HOST"     = azurerm_postgresql_flexible_server.apimanager.fqdn
    "DATABASE_NAME"     = azurerm_postgresql_flexible_server_database.apimanager.name
    "DATABASE_USER"     = "${var.db_admin_username}@${azurerm_postgresql_flexible_server.apimanager.name}"
    "DATABASE_PASSWORD" = var.db_admin_password
    "DATABASE_PORT"     = "5432"
    "DATABASE_SSLMODE"  = "require"
    
    # Connection String completa
    "ConnectionStrings__DefaultConnection" = "Host=${azurerm_postgresql_flexible_server.apimanager.fqdn};Database=${azurerm_postgresql_flexible_server_database.apimanager.name};Username=${var.db_admin_username};Password=${var.db_admin_password};Port=5432;SSL Mode=Require;Trust Server Certificate=true;"
  }
  
  connection_string {
    name  = "DefaultConnection"
    type  = "PostgreSQL"
    value = "Host=${azurerm_postgresql_flexible_server.apimanager.fqdn};Database=${azurerm_postgresql_flexible_server_database.apimanager.name};Username=${var.db_admin_username};Password=${var.db_admin_password};Port=5432;SSL Mode=Require;Trust Server Certificate=true;"
  }
  
  tags = {
    environment = "production"
    project     = "apimanager"
  }
}