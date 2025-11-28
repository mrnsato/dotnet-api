namespace dotnet_api.Models;

// DTOs para Technology
public record TechnologyDto(int Id, string Name);
public record CreateTechnologyDto(string Name);
public record UpdateTechnologyDto(string Name);

// DTOs para Version
public record VersionDto(
    int Id, 
    string Name, 
    int TechnologiesId, 
    bool Standard, 
    string FullName, 
    DateTime? Eos, 
    DateTime? Eol,
    string? TechnologyName
);

public record CreateVersionDto(
    string Name, 
    int TechnologiesId, 
    bool Standard, 
    string FullName, 
    DateTime? Eos, 
    DateTime? Eol
);

public record UpdateVersionDto(
    string Name, 
    int TechnologiesId, 
    bool Standard, 
    string FullName, 
    DateTime? Eos, 
    DateTime? Eol
);

// DTOs para Application
public record ApplicationDto(int Id, string Name, bool Active);
public record CreateApplicationDto(string Name, bool Active);
public record UpdateApplicationDto(string Name, bool Active);

// DTOs para ApplicationVersion
public record ApplicationVersionDto(
    int Id, 
    int ApplicationId, 
    int VersionId,
    string? ApplicationName,
    string? VersionName
);

public record CreateApplicationVersionDto(int ApplicationId, int VersionId);