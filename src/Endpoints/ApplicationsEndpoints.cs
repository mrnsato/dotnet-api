using Microsoft.EntityFrameworkCore;
using dotnet_api.Data;
using dotnet_api.Data.Entities;
using dotnet_api.Models;

namespace dotnet_api.Endpoints;

public static class ApplicationsEndpoints
{
    public static void MapApplicationsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/applications").WithTags("Applications");

        // GET: Listar todas as aplicações
        group.MapGet("/", async (AppDbContext db) =>
        {
            var applications = await db.Applications
                .Select(a => new ApplicationDto(a.Id, a.Name, a.Active))
                .ToListAsync();
            
            return Results.Ok(applications);
        })
        .WithName("GetAllApplications")
        .Produces<List<ApplicationDto>>(StatusCodes.Status200OK);

        // GET: Buscar aplicação por ID
        group.MapGet("/{id}", async (int id, AppDbContext db) =>
        {
            var application = await db.Applications.FindAsync(id);
            
            if (application == null)
                return Results.NotFound(new { message = "Aplicação não encontrada" });
            
            return Results.Ok(new ApplicationDto(application.Id, application.Name, application.Active));
        })
        .WithName("GetApplicationById")
        .Produces<ApplicationDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        // GET: Buscar aplicações ativas
        group.MapGet("/active", async (AppDbContext db) =>
        {
            var applications = await db.Applications
                .Where(a => a.Active)
                .Select(a => new ApplicationDto(a.Id, a.Name, a.Active))
                .ToListAsync();
            
            return Results.Ok(applications);
        })
        .WithName("GetActiveApplications")
        .Produces<List<ApplicationDto>>(StatusCodes.Status200OK);

        // POST: Criar nova aplicação
        group.MapPost("/", async (CreateApplicationDto dto, AppDbContext db) =>
        {
            var application = new Application 
            { 
                Name = dto.Name, 
                Active = dto.Active 
            };
            
            db.Applications.Add(application);
            await db.SaveChangesAsync();
            
            var result = new ApplicationDto(application.Id, application.Name, application.Active);
            return Results.Created($"/api/applications/{application.Id}", result);
        })
        .WithName("CreateApplication")
        .Produces<ApplicationDto>(StatusCodes.Status201Created);

        // PUT: Atualizar aplicação
        group.MapPut("/{id}", async (int id, UpdateApplicationDto dto, AppDbContext db) =>
        {
            var application = await db.Applications.FindAsync(id);
            
            if (application == null)
                return Results.NotFound(new { message = "Aplicação não encontrada" });
            
            application.Name = dto.Name;
            application.Active = dto.Active;
            await db.SaveChangesAsync();
            
            return Results.Ok(new ApplicationDto(application.Id, application.Name, application.Active));
        })
        .WithName("UpdateApplication")
        .Produces<ApplicationDto>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

        // DELETE: Remover aplicação
        group.MapDelete("/{id}", async (int id, AppDbContext db) =>
        {
            var application = await db.Applications.FindAsync(id);
            
            if (application == null)
                return Results.NotFound(new { message = "Aplicação não encontrada" });
            
            db.Applications.Remove(application);
            await db.SaveChangesAsync();
            
            return Results.NoContent();
        })
        .WithName("DeleteApplication")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound);
    }
}