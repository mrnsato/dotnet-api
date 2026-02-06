using Microsoft.EntityFrameworkCore;
using Data;
using Models;
using Entities;


namespace Endpoints;

public static class ApplicationsEndpoints
{
    public static void MapApplicationsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/applications").WithTags("Applications");

        // GET: Listar todas as aplicações
        group.MapGet("/", async (AppDbContext db) =>
        {
            var application = await db.Applications
                .Select(a => new ApplicationDto()
                    {
                        Id = a.Id,
                        Name = a.Name,
                        Active = a.Active ?? false
                    }
                )
                .ToListAsync();
            
            return Results.Ok(application);
        });

        // GET: Buscar aplicação por ID
        group.MapGet("/{id}", async (int id, AppDbContext db) =>
        {
            var application = await db.Applications.FindAsync(id);
            
            if (application == null)
                return Results.NotFound(new { message = "Aplicação não encontrada" });

            var returnDto = new ApplicationDto()
            {
                Id = application.Id,
                Name = application.Name,
                Active = application.Active ?? false
            };

            return Results.Ok(returnDto);
        });

        // GET: Buscar aplicações ativas
        group.MapGet("/active", async (AppDbContext db) =>
        {
            var application = await db.Applications
                .Where(a => a.Active ?? false)
                .Select(a => new ApplicationDto()
                    { 
                        Id = a.Id,
                        Name = a.Name,
                        Active = a.Active ?? false
                    })
                .ToListAsync();
            
            return Results.Ok(application);
        });

        // POST: Criar nova aplicação
        group.MapPost("/", async (ApplicationDto dto, AppDbContext db) =>
        {
            var application = new Application
            { 
                Name = dto.Name, 
                Active = dto.Active 
            };
            
            db.Applications.Add(application);
            await db.SaveChangesAsync();
            
            var result = new ApplicationDto()
            {
                Id = application.Id,
                Name = application.Name,
                Active = application.Active ?? false
            };
            return Results.Created($"/api/applications/{application.Id}", result);
        });

        // PUT: Atualizar aplicação
        group.MapPut("/{id}", async (int id, ApplicationDto dto, AppDbContext db) =>
        {
            var application = await db.Applications.FindAsync(id);
            
            if (application == null)
                return Results.NotFound(new { message = "Aplicação não encontrada" });
            
            application.Name = dto.Name;
            application.Active = dto.Active;
            await db.SaveChangesAsync();
            
            return Results.Ok(new ApplicationDto()
            {
                Id = application.Id,
                Name = application.Name,
                Active = application.Active ?? false
            });
        });

        // DELETE: Remover aplicação
        group.MapDelete("/{id}", async (int id, AppDbContext db) =>
        {
            var application = await db.Applications.FindAsync(id);
            
            if (application == null)
                return Results.NotFound(new { message = "Aplicação não encontrada" });
            
            db.Applications.Remove(application);
            await db.SaveChangesAsync();
            
            return Results.NoContent();
        });
    }
}