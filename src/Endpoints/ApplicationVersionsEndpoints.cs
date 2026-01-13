using Microsoft.EntityFrameworkCore;
using Data;
using Entities;
using Models;

namespace Endpoints;

public static class ApplicationVersionsEndpoints
{
    public static void MapApplicationVersionsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/application-versions").WithTags("Application Versions");

        // GET: Listar todas as associações
        group.MapGet("/", async (AppDbContext db) =>
        {
            var appVersions = await db.ApplicationVersions
                .Include(av => av.Application)
                .Include(av => av.Version)
                .Select(av => new ApplicationVersionDto()
                    {
                        Id = av.Id,
                        ApplicationId = av.ApplicationId,
                        VersionId = av.VersionId,
                        ApplicationName = av.Application.Name,
                        VersionName = av.Version.FullName
                    }
                )
                .ToListAsync();
            
            return Results.Ok(appVersions);
        });

        // GET: Buscar por ID
        group.MapGet("/{id}", async (int id, AppDbContext db) =>
        {
            var appVersion = await db.ApplicationVersions
                .Include(av => av.Application)
                .Include(av => av.Version)
                .FirstOrDefaultAsync(av => av.Id == id);
            
            if (appVersion == null)
                return Results.NotFound(new { message = "Associação não encontrada" });
            
            var dto = new ApplicationVersionDto()
                {
                    Id = appVersion.Id,
                    ApplicationId = appVersion.ApplicationId,
                    VersionId = appVersion.VersionId,
                    ApplicationName = appVersion.Application.Name,
                    VersionName = appVersion.Version.FullName
                };
            
            return Results.Ok(dto);
        });

        // GET: Buscar versões de uma aplicação
        group.MapGet("/application/{applicationId}", async (int applicationId, AppDbContext db) =>
        {
            var appVersions = await db.ApplicationVersions
                .Include(av => av.Application)
                .Include(av => av.Version)
                    .ThenInclude(v => v.Technology)
                .Where(av => av.ApplicationId == applicationId)
                .Select(av => new ApplicationVersionDto()
                    {
                        Id = av.Id,
                        ApplicationId = av.ApplicationId,
                        VersionId = av.VersionId,
                        ApplicationName = av.Application.Name,
                        VersionName = $"{av.Version.Technology.Name} {av.Version.FullName}"
                    }
                )
                        .ToListAsync();
            
            return Results.Ok(appVersions);
        });

        // GET: Buscar aplicações que usam uma versão
        group.MapGet("/version/{versionId}", async (int versionId, AppDbContext db) =>
        {
            var appVersions = await db.ApplicationVersions
                .Include(av => av.Application)
                .Include(av => av.Version)
                .Where(av => av.VersionId == versionId)
                .Select(av => new ApplicationVersionDto()
                    {
                        Id = av.Id,
                        ApplicationId = av.ApplicationId,
                        VersionId = av.VersionId,
                        ApplicationName = av.Application.Name,
                        VersionName = av.Version.FullName
                    }                
                )
                .ToListAsync();
            
            return Results.Ok(appVersions);
        });

        // POST: Criar nova associação
        group.MapPost("/", async (ApplicationVersionDto dto, AppDbContext db) =>
        {
            var application = await db.Applications.FindAsync(dto.ApplicationId);
            if (application == null)
                return Results.BadRequest(new { message = "Aplicação não encontrada" });

            var version = await db.Versions.FindAsync(dto.VersionId);
            if (version == null)
                return Results.BadRequest(new { message = "Versão não encontrada" });

            // Verificar se a associação já existe
            var exists = await db.ApplicationVersions
                .AnyAsync(av => av.ApplicationId == dto.ApplicationId && av.VersionId == dto.VersionId);
            
            if (exists)
                return Results.BadRequest(new { message = "Esta associação já existe" });

            var appVersion = new ApplicationVersion
            {
                ApplicationId = dto.ApplicationId,
                VersionId = dto.VersionId
            };
            
            db.ApplicationVersions.Add(appVersion);
            await db.SaveChangesAsync();
            
            var result = new ApplicationVersionDto()
                {
                    Id = appVersion.Id,
                    ApplicationId = appVersion.ApplicationId,
                    VersionId = appVersion.VersionId,
                    ApplicationName = application.Name,
                    VersionName = version.FullName
                };
            
            return Results.Created($"/api/application-versions/{appVersion.Id}", result);
        });

        // DELETE: Remover associação
        group.MapDelete("/{id}", async (int id, AppDbContext db) =>
        {
            var appVersion = await db.ApplicationVersions.FindAsync(id);
            
            if (appVersion == null)
                return Results.NotFound(new { message = "Associação não encontrada" });
            
            db.ApplicationVersions.Remove(appVersion);
            await db.SaveChangesAsync();
            
            return Results.NoContent();
        });
    }
}