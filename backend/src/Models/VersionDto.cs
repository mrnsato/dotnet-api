
namespace Models;

// DTOs para Version
public record VersionDto{
    public int Id { get; init; } 
    public string Name { get; init; } = string.Empty;
    public int TechnologiesId { get; init; }
     public bool Standard { get; init; } 
    public string FullName { get; init; } = string.Empty;
    
    public DateOnly? Eos { get; init; } 
    public DateOnly? Eol { get; init; }
    public string? TechnologyName { get; init; }
} 