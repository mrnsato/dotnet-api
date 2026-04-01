using Microsoft.EntityFrameworkCore;
using Entities;


namespace Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Technology> Technologies { get; set; }
    public DbSet<Entities.Version> Versions { get; set; }
    public DbSet<Application> Applications { get; set; }
    public DbSet<ApplicationVersion> ApplicationVersions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurar ON DELETE CASCADE para Version -> Technology
        modelBuilder.Entity<Entities.Version>()
            .HasOne(v => v.Technology)
            .WithMany(t => t.Versions)
            .HasForeignKey(v => v.TechnologiesId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}