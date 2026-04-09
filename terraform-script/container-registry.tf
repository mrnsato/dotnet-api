# Azure Container Registry
resource "azurerm_container_registry" "apimanager" {
  name                = "apimanagerregistry"
  resource_group_name = azurerm_resource_group.apimanager.name
  location            = azurerm_resource_group.apimanager.location
  sku                 = "Basic"
  admin_enabled       = true
}

# Outputs
output "container_registry_login_server" {
  value       = azurerm_container_registry.apimanager.login_server
  description = "The login server of the container registry"
}

output "container_registry_admin_username" {
  value       = azurerm_container_registry.apimanager.admin_username
  description = "The admin username for the container registry"
}

output "container_registry_admin_password" {
  value       = azurerm_container_registry.apimanager.admin_password
  sensitive   = true
  description = "The admin password for the container registry"
}
