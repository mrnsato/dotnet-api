
namespace Models;

// DTOs para Application
public record ApplicationDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public bool Active { get; init; }
}