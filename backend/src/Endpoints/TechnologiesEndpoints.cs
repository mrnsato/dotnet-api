using Microsoft.EntityFrameworkCore;
using Data;
using Entities;
using Models;

namespace Endpoints;

public static class TechnologiesEndpoints
{
    public static void MapTechnologiesEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/technology").WithTags("Technologies");

        // GET: Listar todas as tecnologias
        group.MapGet("/", async (AppDbContext db) =>
        {
            var technologies = await db.Technologies
                .Select(t => new TechnologyDto()
                    {
                        Id = t.Id,
                        Name = t.Name
                    }
                )
                .ToListAsync();
            
            return Results.Ok(technologies);
        });

        // GET: Buscar tecnologia por ID
        group.MapGet("/{id}", async (int id, AppDbContext db) =>
        {
            var technology = await db.Technologies.FindAsync(id);
            
            if (technology == null)
                return Results.NotFound(new { message = "Tecnologia não encontrada" });
            
            return Results.Ok(new TechnologyDto()
                {
                    Id = technology.Id,
                    Name = technology.Name
                }
            );
        });

        // POST: Criar nova tecnologia
        group.MapPost("/", async (TechnologyDto dto, AppDbContext db) =>
        {
            var technology = new Technology { Name = dto.Name };
            
            db.Technologies.Add(technology);
            await db.SaveChangesAsync();
            
            var result = new TechnologyDto()
                {
                    Id = technology.Id,
                    Name = technology.Name
                }
            ;
            return Results.Created($"/api/technologies/{technology.Id}", result);
        });

        // PUT: Atualizar tecnologia
        group.MapPut("/{id}", async (int id, TechnologyDto dto, AppDbContext db) =>
        {
            var technology = await db.Technologies.FindAsync(id);
            
            if (technology == null)
                return Results.NotFound(new { message = "Tecnologia não encontrada" });
            
            technology.Name = dto.Name;
            await db.SaveChangesAsync();
            
            return Results.Ok(new TechnologyDto()
                {
                    Id = technology.Id,
                    Name = technology.Name
                }
            );
        });

        // DELETE: Remover tecnologia
        group.MapDelete("/{id}", async (int id, AppDbContext db) =>
        {
            var technology = await db.Technologies.FindAsync(id);
            
            if (technology == null)
                return Results.NotFound(new { message = "Tecnologia não encontrada" });
            
            db.Technologies.Remove(technology);
            await db.SaveChangesAsync();
            
            return Results.NoContent();
        });
    }
}
