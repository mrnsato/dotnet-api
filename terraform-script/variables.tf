variable "docker_image_name" {
  type        = string
  description = "Docker image name"
  default     = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
}

variable "resource_group_name" {
  type        = string
  description = "Nome do Resource Group"
  default     = "arch-coe-apimanager-rg"
}

variable "location" {
  type        = string
  description = "Localização dos recursos Azure"
  default     = "East US2"
}

# Database Variables
variable "db_admin_username" {
  type        = string
  description = "PostgreSQL administrator username"
  default     = "apimanager_admin"
  sensitive   = true
}

variable "db_admin_password" {
  type        = string
  description = "PostgreSQL administrator password"
  sensitive   = true
}

variable "database_name" {
  type        = string
  description = "Nome do banco de dados"
  default     = "apimanager_db"
}

variable "acr_name" {
  type        = string
  description = "Nome do Azure Container Registry"
  default     = "apimanageracr"
}