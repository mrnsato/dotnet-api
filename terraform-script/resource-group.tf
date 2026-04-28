resource "azurerm_resource_group" "apimanager" {
  name     = var.resource_group_name
  location = var.location
  
  tags = {
    environment = "production"
    project     = "apimanager"
    managed_by  = "terraform"
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