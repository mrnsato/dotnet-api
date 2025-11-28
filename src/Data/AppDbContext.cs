using Microsoft.EntityFrameworkCore;
using dotnet_api.Data.Entities;

namespace dotnet_api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Technology> Technologies { get; set; }
    public DbSet<Entities.SoftwareVersion> Versions { get; set; }
    public DbSet<Application> Applications { get; set; }
    public DbSet<ApplicationVersion> ApplicationVersions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuração da tabela Technologies
        modelBuilder.Entity<Technology>(entity =>
        {
            entity.ToTable("technologies");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name").HasMaxLength(50).IsRequired();
        });

        // Configuração da tabela Versions
        modelBuilder.Entity<Entities.Version>(entity =>
        {
            entity.ToTable("versions");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name").HasMaxLength(50).IsRequired();
            entity.Property(e => e.TechnologiesId).HasColumnName("technologies_id");
            entity.Property(e => e.Standard).HasColumnName("standard");
            entity.Property(e => e.FullName).HasColumnName("full_name").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Eos).HasColumnName("eos");
            entity.Property(e => e.Eol).HasColumnName("eol");

            entity.HasOne(v => v.Technology)
                  .WithMany(t => t.Versions)
                  .HasForeignKey(v => v.TechnologiesId);
        });

        // Configuração da tabela Applications
        modelBuilder.Entity<Application>(entity =>
        {
            entity.ToTable("applications");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name").HasMaxLength(50).IsRequired();
            entity.Property(e => e.Active).HasColumnName("active");
        });

        // Configuração da tabela Applications_Versions
        modelBuilder.Entity<ApplicationVersion>(entity =>
        {
            entity.ToTable("applications_versions");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ApplicationId).HasColumnName("application_id");
            entity.Property(e => e.VersionId).HasColumnName("version_id");

            entity.HasOne(av => av.Application)
                  .WithMany(a => a.ApplicationVersion)
                  .HasForeignKey(av => av.ApplicationId);

            entity.HasOne(av => av.Version)
                  .WithMany(v => v.ApplicationsVersions)
                  .HasForeignKey(av => av.VersionId);
        });
    }
}