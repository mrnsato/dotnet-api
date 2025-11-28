using Microsoft.EntityFrameworkCore;
using dotnet_api.Data;
using dotnet_api.Data.Entities;
using dotnet_api.Models;

namespace dotnet_api.Endpoints;

public static class TechnologiesEndpoints
{
    public static void MapTechnologiesEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/technologies").WithTags("Technologies");

        // GET: Listar todas as tecnologias
        group.MapGet("/", async (AppDbContext db) =>
        {
            var technologies = await db.Technologies
                .Select(t => new TechnologyDto(t.Id, t.Name))
                .ToListAsync();
            
            return Results.Ok(technologies);
        })
        .WithName("GetAllTechnologies")
        .Produces<List<TechnologyDto>>(StatusCodes.Status200OK);

        // GET: Buscar tecnologia por ID
        group.MapGet("/{id}", async (int id, AppDbContext db) =>
        {
            var technology = await db.Technologies.FindAsync(id);
            
            if (technology == null)
                return Results.NotFound(new { message = "Tecnologia não encontrada" });
            
            return Results.Ok(new TechnologyDto(technology.Id, technology.Name));
        })
        .WithName("GetTechnologyById")
        .Produces<TechnologyDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        // POST: Criar nova tecnologia
        group.MapPost("/", async (CreateTechnologyDto dto, AppDbContext db) =>
        {
            var technology = new Technology { Name = dto.Name };
            
            db.Technologies.Add(technology);
            await db.SaveChangesAsync();
            
            var result = new TechnologyDto(technology.Id, technology.Name);
            return Results.Created($"/api/technologies/{technology.Id}", result);
        })
        .WithName("CreateTechnology")
        .Produces<TechnologyDto>(StatusCodes.Status201Created);

        // PUT: Atualizar tecnologia
        group.MapPut("/{id}", async (int id, UpdateTechnologyDto dto, AppDbContext db) =>
        {
            var technology = await db.Technologies.FindAsync(id);
            
            if (technology == null)
                return Results.NotFound(new { message = "Tecnologia não encontrada" });
            
            technology.Name = dto.Name;
            await db.SaveChangesAsync();
            
            return Results.Ok(new TechnologyDto(technology.Id, technology.Name));
        })
        .WithName("UpdateTechnology")
        .Produces<TechnologyDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        // DELETE: Remover tecnologia
        group.MapDelete("/{id}", async (int id, AppDbContext db) =>
        {
            var technology = await db.Technologies.FindAsync(id);
            
            if (technology == null)
                return Results.NotFound(new { message = "Tecnologia não encontrada" });
            
            db.Technologies.Remove(technology);
            await db.SaveChangesAsync();
            
            return Results.NoContent();
        })
        .WithName("DeleteTechnology")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound);
    }
}
