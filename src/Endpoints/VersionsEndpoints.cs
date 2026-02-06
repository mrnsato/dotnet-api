using Microsoft.EntityFrameworkCore;
using Data;
using Models;
using Entities;



namespace Endpoints;

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
                .Select(v => new VersionDto()
                    {
                        Id = v.Id,
                        Name = v.Name,
                        TechnologiesId = v.TechnologiesId,
                        Standard = v.Standard,
                        FullName = v.FullName,
                        Eos = v.Eos,
                        Eol = v.Eol,
                        TechnologyName = v.Technology.Name
                    }
                )
                .ToListAsync();
            
            return Results.Ok(versions);
        });

        // GET: Buscar versão por ID
        group.MapGet("/{id}", async (int id, AppDbContext db) =>
        {
            var version = await db.Versions
                .Include(v => v.Technology)
                .FirstOrDefaultAsync(v => v.Id == id);
            
            if (version == null)
                return Results.NotFound(new { message = "Versão não encontrada" });
            
            var dto = new VersionDto()
                {
                    Id = version.Id,
                    Name = version.Name,
                    TechnologiesId = version.TechnologiesId,
                    Standard = version.Standard,
                    FullName = version.FullName,
                    Eos = version.Eos,
                    Eol = version.Eol,
                    TechnologyName = version.Technology.Name
                };
            
            return Results.Ok(dto);
        });

        // GET: Buscar versões por tecnologia
        group.MapGet("/technology/{technologyId}", async (int technologyId, AppDbContext db) =>
        {
            var versions = await db.Versions
                .Include(v => v.Technology)
                .Where(v => v.TechnologiesId == technologyId)
                .Select(v => new VersionDto()
                    {
                        Id = v.Id,
                        Name = v.Name,
                        TechnologiesId = v.TechnologiesId,
                        Standard = v.Standard,
                        FullName = v.FullName,
                        Eos = v.Eos,
                        Eol = v.Eol,
                        TechnologyName = v.Technology.Name
                    }
                )
                .ToListAsync();
            
            return Results.Ok(versions);
        });

        // POST: Criar nova versão
        _ = group.MapPost("/", async (VersionDto dto, AppDbContext db) =>
        {
            var technology = await db.Technologies.FindAsync(dto.TechnologiesId);
            if (technology == null)
                return Results.BadRequest(new { message = "Tecnologia não encontrada" });

            var version = new Entities.Version
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

            var result = new VersionDto()
            {
                Id = version.Id,
                Name = version.Name,
                TechnologiesId = version.TechnologiesId,
                Standard = version.Standard,
                FullName = version.FullName,
                Eos = version.Eos,
                Eol = version.Eol,
                TechnologyName = technology.Name
            };

            return Results.Created($"/api/versions/{version.Id}", result);
        });

        // PUT: Atualizar versão
        group.MapPut("/{id}", async (int id, VersionDto dto, AppDbContext db) =>
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
            
            var result = new VersionDto()
                {
                    Id = version.Id,
                    Name = version.Name,
                    TechnologiesId = version.TechnologiesId,
                    Standard = version.Standard,
                    FullName = version.FullName,
                    Eos = version.Eos,
                    Eol = version.Eol,
                    TechnologyName = technology.Name
                }
            ;
            
            return Results.Ok(result);
        });

        // DELETE: Remover versão
        group.MapDelete("/{id}", async (int id, AppDbContext db) =>
        {
            var version = await db.Versions.FindAsync(id);
            
            if (version == null)
                return Results.NotFound(new { message = "Versão não encontrada" });
            
            db.Versions.Remove(version);
            await db.SaveChangesAsync();
            
            return Results.NoContent();
        });
    }
}