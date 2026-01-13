using Microsoft.EntityFrameworkCore;
using Data;
using Endpoints;
using Entities;

var builder = WebApplication.CreateBuilder(args);

// Configuração do DbContext com PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Enable API explorer required by Swagger/OpenAPI generation for minimal APIs
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "dotnet_api", Version = "v1" });
});

var app = builder.Build();

// Configurar o pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();       // Serve generated Swagger as JSON
    app.UseSwaggerUI();     // Interface Swagger UI em /swagger
}

app.UseHttpsRedirection();

// Registrar endpoints
app.MapTechnologiesEndpoints();
app.MapVersionsEndpoints();
app.MapApplicationsEndpoints();
app.MapApplicationVersionsEndpoints();
app.Run();