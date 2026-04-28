# Container App Environment
resource "azurerm_container_app_environment" "apimanager" {
  name                = "apimanager-container-env"
  location            = azurerm_resource_group.apimanager.location
  resource_group_name = azurerm_resource_group.apimanager.name
}

# Container App
resource "azurerm_container_app" "apimanager" {
  name                         = "api-manager-container"
  resource_group_name          = azurerm_resource_group.apimanager.name
  container_app_environment_id = azurerm_container_app_environment.apimanager.id
  revision_mode                = "Single"

  registry {
    server               = azurerm_container_registry.apimanager.login_server
    username             = azurerm_container_registry.apimanager.admin_username
    password_secret_name = "acr-password"
  }

  secret {
    name  = "acr-password"
    value = azurerm_container_registry.apimanager.admin_password
  }

  # Adicionar timeouts
  timeouts {
    create = "60m"
    update = "60m"
    read   = "10m"
    delete = "60m"
  }

  lifecycle {
    ignore_changes = [
      tags
    ]
  }
  template {
    container {
      name   = "api-manager-container"
      image  = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
      cpu    = 0.5
      memory = "1Gi"
    }

    min_replicas = 1
    max_replicas = 3
  }

  ingress {
    external_enabled = true
    target_port      = 80

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}

# Outputs
output "container_app_url" {
  value       = azurerm_container_app.apimanager.latest_revision_fqdn
  description = "URL do Container App"
}

output "container_app_environment_id" {
  value       = azurerm_container_app_environment.apimanager.id
  description = "ID do Container App Environment"
}
