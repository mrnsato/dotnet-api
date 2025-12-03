using Microsoft.EntityFrameworkCore;
using dotnet_api.Data.Entities;

namespace dotnet_api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Technology> Technologies { get; set; }
    public DbSet<Entities.Version> Versions { get; set; }
    public DbSet<Application> Applications { get; set; }
    public DbSet<ApplicationVersion> ApplicationVersions { get; set; }
}