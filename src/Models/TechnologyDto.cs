 namespace Models;

// DTOs para Technology

public record TechnologyDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
}
