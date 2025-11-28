using Microsoft.EntityFrameworkCore;
using dotnet_api.Data;
using dotnet_api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// Configuração do DbContext com PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Adicionar serviços
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configurar o pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Registrar endpoints
app.MapTechnologiesEndpoints();
app.MapVersionsEndpoints();
app.MapApplicationsEndpoints();
app.MapApplicationVersionsEndpoints();

app.Run();