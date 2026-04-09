variable "docker_image_name" {
  type        = string
  description = "Docker image name (e.g., myapp:latest or myregistry.azurecr.io/myapp:latest)"
  default     = "myapp:latest"
}