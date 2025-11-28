using Microsoft.EntityFrameworkCore;
using dotnet_api.Data;
using dotnet_api.Models;

namespace dotnet_api.Endpoints;

public static class VersionsEndpoints
{
    public static void MapVersionsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/versions").WithTags("Versions");

        // GET: Listar todas as versões
        group.MapGet("/", async (AppDbContext db) =>
        {
            var versions = await db.Versions
                .Include(v => v.Technology)
                .Select(v => new VersionDto(
                    v.Id,
                    v.Name,
                    v.TechnologiesId,
                    v.Standard,
                    v.FullName,
                    v.Eos,
                    v.Eol,
                    v.Technology.Name
                ))
                .ToListAsync();
            
            return Results.Ok(versions);
        })
        .WithName("GetAllVersions")
        .Produces<List<VersionDto>>(StatusCodes.Status200OK);

        // GET: Buscar versão por ID
        group.MapGet("/{id}", async (int id, AppDbContext db) =>
        {
            var version = await db.Versions
                .Include(v => v.Technology)
                .FirstOrDefaultAsync(v => v.Id == id);
            
            if (version == null)
                return Results.NotFound(new { message = "Versão não encontrada" });
            
            var dto = new VersionDto(
                version.Id,
                version.Name,
                version.TechnologiesId,
                version.Standard,
                version.FullName,
                version.Eos,
                version.Eol,
                version.Technology.Name
            );
            
            return Results.Ok(dto);
        })
        .WithName("GetVersionById")
        .Produces<VersionDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        // GET: Buscar versões por tecnologia
        group.MapGet("/technology/{technologyId}", async (int technologyId, AppDbContext db) =>
        {
            var versions = await db.Versions
                .Include(v => v.Technology)
                .Where(v => v.TechnologiesId == technologyId)
                .Select(v => new VersionDto(
                    v.Id,
                    v.Name,
                    v.TechnologiesId,
                    v.Standard,
                    v.FullName,
                    v.Eos,
                    v.Eol,
                    v.Technology.Name
                ))
                .ToListAsync();
            
            return Results.Ok(versions);
        })
        .WithName("GetVersionsByTechnology")
        .Produces<List<VersionDto>>(StatusCodes.Status200OK);

        // POST: Criar nova versão
        group.MapPost("/", async (CreateVersionDto dto, AppDbContext db) =>
        {
            var technology = await db.Technologies.FindAsync(dto.TechnologiesId);
            if (technology == null)
                return Results.BadRequest(new { message = "Tecnologia não encontrada" });

            var version = new Data.Entities.Version
            {
                Name = dto.Name,
                TechnologiesId = dto.TechnologiesId,
                Standard = dto.Standard,
                FullName = dto.FullName,
                Eos = dto.Eos,
                Eol = dto.Eol
            };
            
            db.Versions.Add(version);
            await db.SaveChangesAsync();
            
            var result = new VersionDto(
                version.Id,
                version.Name,
                version.TechnologiesId,
                version.Standard,
                version.FullName,
                version.Eos,
                version.Eol,
                technology.Name
            );
            
            return Results.Created($"/api/versions/{version.Id}", result);
        })
        .WithName("CreateVersion")
        .Produces<VersionDto>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest);

        // PUT: Atualizar versão
        group.MapPut("/{id}", async (int id, UpdateVersionDto dto, AppDbContext db) =>
        {
            var version = await db.Versions.FindAsync(id);
            
            if (version == null)
                return Results.NotFound(new { message = "Versão não encontrada" });

            var technology = await db.Technologies.FindAsync(dto.TechnologiesId);
            if (technology == null)
                return Results.BadRequest(new { message = "Tecnologia não encontrada" });
            
            version.Name = dto.Name;
            version.TechnologiesId = dto.TechnologiesId;
            version.Standard = dto.Standard;
            version.FullName = dto.FullName;
            version.Eos = dto.Eos;
            version.Eol = dto.Eol;
            
            await db.SaveChangesAsync();
            
            var result = new VersionDto(
                version.Id,
                version.Name,
                version.TechnologiesId,
                version.Standard,
                version.FullName,
                version.Eos,
                version.Eol,
                technology.Name
            );
            
            return Results.Ok(result);
        })
        .WithName("UpdateVersion")
        .Produces<VersionDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status400BadRequest);

        // DELETE: Remover versão
        group.MapDelete("/{id}", async (int id, AppDbContext db) =>
        {
            var version = await db.Versions.FindAsync(id);
            
            if (version == null)
                return Results.NotFound(new { message = "Versão não encontrada" });
            
            db.Versions.Remove(version);
            await db.SaveChangesAsync();
            
            return Results.NoContent();
        })
        .WithName("DeleteVersion")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound);
    }
}