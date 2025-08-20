using SperlingDU.DAL.Entities;
using SperlingDU.DAL.Repositories;

namespace SperlingDU.DAL.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<SystemSettings> SystemSettings { get; }
        IRepository<EmailTemplate> EmailTemplates { get; }
        IRepository<FileAttachment> FileAttachments { get; }

        Task<int> SaveAsync();
    }
}
