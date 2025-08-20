using Microsoft.EntityFrameworkCore;
using SperlingDU.DAL.Entities;
using SperlingDU.DAL.SeedData;

namespace SperlingDU.DAL
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<SystemSettings> SystemSettings { get; set; }
        public DbSet<EmailTemplate> EmailTemplates { get; set; }
        public DbSet<FileAttachment> FileAttachments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            SeedDevelopment.Seed(modelBuilder);
        }
    }
}
