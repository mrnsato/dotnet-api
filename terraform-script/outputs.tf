# Web App Outputs
output "webapp_url" {
  value       = "https://${azurerm_linux_web_app.apimanager.default_hostname}"
  description = "URL do Web App"
}

output "webapp_name" {
  value       = azurerm_linux_web_app.apimanager.name
  description = "Nome do Web App"
}

# Container Registry Outputs
output "acr_login_server" {
  value       = azurerm_container_registry.apimanager.login_server
  description = "Login server do Azure Container Registry"
}

output "acr_admin_username" {
  value       = azurerm_container_registry.apimanager.admin_username
  description = "Admin username do ACR"
  sensitive   = true
}

# Database Outputs
output "postgres_server_fqdn" {
  value       = azurerm_postgresql_flexible_server.apimanager.fqdn
  description = "FQDN do PostgreSQL Server"
}

output "postgres_server_name" {
  value       = azurerm_postgresql_flexible_server.apimanager.name
  description = "Nome do PostgreSQL Server"
}

output "database_name" {
  value       = azurerm_postgresql_flexible_server_database.apimanager.name
  description = "Nome do Database"
}

output "database_connection_string" {
  value       = "Host=${azurerm_postgresql_flexible_server.apimanager.fqdn};Database=${azurerm_postgresql_flexible_server_database.apimanager.name};Username=${var.db_admin_username};Password=***;Port=5432;SSL Mode=Require;"
  description = "Connection String do PostgreSQL (senha oculta)"
  sensitive = true
}

output "database_admin_username" {
  value       = var.db_admin_username
  description = "Username do administrador do banco"
  sensitive   = true
}

# Resource Group Output
output "resource_group_name" {
  value       = azurerm_resource_group.apimanager.name
  description = "Nome do Resource Group"
}