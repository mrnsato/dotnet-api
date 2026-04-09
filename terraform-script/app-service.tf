# App Service Plan
resource "azurerm_service_plan" "apimanager" {
  name                = "apimanager-service-plan"
  location            = azurerm_resource_group.apimanager.location
  resource_group_name = azurerm_resource_group.apimanager.name
  os_type             = "Linux"
  sku_name            = "F1"
}

# App Service (Web App)
resource "azurerm_linux_web_app" "apimanager" {
  name                = "apimanager-api-webapp"
  location            = azurerm_resource_group.apimanager.location
  resource_group_name = azurerm_resource_group.apimanager.name
  service_plan_id     = azurerm_service_plan.apimanager.id
  https_only          = true

  site_config {
    always_on = false

    application_stack {
      docker_image_name   = "${azurerm_container_registry.apimanager.login_server}/${var.docker_image_name}"
      docker_registry_url = "https://${azurerm_container_registry.apimanager.login_server}"
      docker_registry_username = azurerm_container_registry.apimanager.admin_username
      docker_registry_password = azurerm_container_registry.apimanager.admin_password
    }
  }

  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
  }
}