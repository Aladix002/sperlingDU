using SperlingDU.BLL.DTOs;

namespace SperlingDU.BLL.Services
{
    public interface IEmailTemplateService
    {
        Task<IEnumerable<EmailTemplateDto>> GetAllTemplatesAsync();
        Task<EmailTemplateDto> GetTemplateByIdAsync(int id);
        Task<EmailTemplateDto> CreateTemplateAsync(CreateEmailTemplateDto createDto);
        Task<EmailTemplateDto> UpdateTemplateAsync(int id, UpdateEmailTemplateDto updateDto);
        Task<bool> DeleteTemplateAsync(int id);
        Task<IEnumerable<EmailTemplateDto>> SearchTemplatesAsync(string searchTerm);
        Task<byte[]> ExportTemplateAsDocxAsync(int id);
        Task<string> SaveTemplateAsDocxToCudAsync(int id, string cudPath);
        Task<byte[]> ExportTemplateAsPdfAsync(int id);
    }
}
