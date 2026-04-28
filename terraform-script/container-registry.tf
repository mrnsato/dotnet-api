resource "azurerm_container_registry" "apimanager" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.apimanager.name
  location            = azurerm_resource_group.apimanager.location
  sku                 = "Basic"
  admin_enabled       = true
  
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
  lifecycle {
    ignore_changes = [
      tags
    ]
  }
}