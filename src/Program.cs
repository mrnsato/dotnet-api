using Microsoft.EntityFrameworkCore;
using Data;
using Endpoints;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// Debug: mostrar o ContentRootPath para verificar onde o app procura arquivos
Console.WriteLine($"ContentRootPath: {builder.Environment.ContentRootPath}");

// Garantir que o appsettings.json dentro de `src/` seja carregado quando o content root
// for o diretório do projeto. Opcional=true evita erro caso já esteja sendo carregado.
builder.Configuration.AddJsonFile("src/appsettings.json", optional: true, reloadOnChange: true);

var connectionString = Environment.GetEnvironmentVariable("MY_CONNECTION_STRING");
if (string.IsNullOrEmpty(connectionString))
{
    Console.WriteLine("ERRO: A variável de ambiente 'MY_CONNECTION_STRING' não está definida.");
    Environment.Exit(1); // Encerra o processo
} try
{
    using var connection = new NpgsqlConnection(connectionString);
    connection.Open();
    Console.WriteLine("Conexão com o banco estabelecida com sucesso.");
}
catch (Exception ex)
{
    
    Console.WriteLine("ERRO AO CONECTAR AO BANCO: " + ex.Message);
    Environment.Exit(1); // Sai da aplicação
}

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


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var allowedOrigins = new List<string>
        {
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:8080",
        };

    if (builder.Environment.IsDevelopment())
        {
            policy.SetIsOriginAllowed(origin => 
            {
                // Permite qualquer localhost em desenvolvimento
                if (origin.StartsWith("http://localhost:") || 
                    origin.StartsWith("http://127.0.0.1:"))
                {
                    return true;
                }
                // Verifica se está na lista de origens permitidas
                return allowedOrigins.Contains(origin);
            });
        }
        else
        {
            // Em produção, seja mais restritivo
            policy.WithOrigins(allowedOrigins.ToArray())
            .AllowAnyMethod()
            .AllowAnyHeader();
        }
    });
});

// Configurar Kestrel para escutar apenas HTTP
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(8080); // HTTP apenas
});


var app = builder.Build();

// CORS deve vir ANTES de UseHttpsRedirection para requisições preflight funcionarem corretamente
app.UseCors("AllowFrontend");

// Configurar o pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();       // Serve generated Swagger as JSON
    app.UseSwaggerUI();     // Interface Swagger UI em /swagger
}

// UseHttpsRedirection apenas em produção para evitar conflitos com CORS em desenvolvimento
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Registrar endpoints
app.MapTechnologiesEndpoints();
app.MapVersionsEndpoints();
app.MapApplicationsEndpoints();
app.MapApplicationVersionsEndpoints();
app.MapGet("/health", () => Results.Ok("API is healthy"));
app.Run();