using SperlingDU.DAL.Entities;
using SperlingDU.DAL.Repositories;

namespace SperlingDU.DAL.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public IRepository<SystemSettings> SystemSettings { get; }
        public IRepository<EmailTemplate> EmailTemplates { get; }
        public IRepository<FileAttachment> FileAttachments { get; }

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            SystemSettings = new Repository<SystemSettings>(_context);
            EmailTemplates = new Repository<EmailTemplate>(_context);
            FileAttachments = new Repository<FileAttachment>(_context);
        }

        public async Task<int> SaveAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }

}
