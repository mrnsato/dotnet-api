
namespace Models;

// DTOs para ApplicationVersion
public record ApplicationVersionDto
{

    public int Id { get; init; }
    public int ApplicationId { get; init; }
    public int VersionId { get; init; }
    public string? ApplicationName { get; init; }
    public string? VersionName { get; init; }
}