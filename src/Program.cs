using Microsoft.EntityFrameworkCore;
using Data;
using Endpoints;

var builder = WebApplication.CreateBuilder(args);

// Debug: mostrar o ContentRootPath para verificar onde o app procura arquivos
Console.WriteLine($"ContentRootPath: {builder.Environment.ContentRootPath}");

// Garantir que o appsettings.json dentro de `src/` seja carregado quando o content root
// for o diretório do projeto. Opcional=true evita erro caso já esteja sendo carregado.
builder.Configuration.AddJsonFile("src/appsettings.json", optional: true, reloadOnChange: true);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
//   var connectionString = "Host=localhost;Port=5432;Database=meubanco;Username=meuusuario;Password=senhasegura123";

 Console.WriteLine($"Using connection string: {connectionString}");

// Configuração do DbContext com PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Enable API explorer required by Swagger/OpenAPI generation for minimal APIs
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "dotnet_api", Version = "v1" });
});

// Configurar CORS para permitir requisições do frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configurar o pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();       // Serve generated Swagger as JSON
    app.UseSwaggerUI();     // Interface Swagger UI em /swagger
}

app.UseHttpsRedirection();

// Usar a política de CORS
app.UseCors("AllowFrontend");

// Registrar endpoints
app.MapTechnologiesEndpoints();
app.MapVersionsEndpoints();
app.MapApplicationsEndpoints();
app.MapApplicationVersionsEndpoints();
app.Run();