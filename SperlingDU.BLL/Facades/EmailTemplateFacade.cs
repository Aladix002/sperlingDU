using SperlingDU.BLL.DTOs;
using SperlingDU.BLL.Services;

namespace SperlingDU.BLL.Facades
{
    public class EmailTemplateFacade : IEmailTemplateFacade
    {
        private readonly IEmailTemplateService _emailTemplateService;

        public EmailTemplateFacade(IEmailTemplateService emailTemplateService)
        {
            _emailTemplateService = emailTemplateService;
        }

        public async Task<IEnumerable<EmailTemplateDto>> GetAllTemplatesAsync()
        {
            return await _emailTemplateService.GetAllTemplatesAsync();
        }

        public async Task<EmailTemplateDto> GetTemplateByIdAsync(int id)
        {
            return await _emailTemplateService.GetTemplateByIdAsync(id);
        }

        public async Task<EmailTemplateDto> CreateTemplateAsync(CreateEmailTemplateDto createDto)
        {
            return await _emailTemplateService.CreateTemplateAsync(createDto);
        }

        public async Task<EmailTemplateDto> UpdateTemplateAsync(int id, UpdateEmailTemplateDto updateDto)
        {
            return await _emailTemplateService.UpdateTemplateAsync(id, updateDto);
        }

        public async Task<bool> DeleteTemplateAsync(int id)
        {
            return await _emailTemplateService.DeleteTemplateAsync(id);
        }

        public async Task<IEnumerable<EmailTemplateDto>> SearchTemplatesAsync(string searchTerm)
        {
            return await _emailTemplateService.SearchTemplatesAsync(searchTerm);
        }

        public async Task<byte[]> ExportTemplateAsDocxAsync(int id)
        {
            return await _emailTemplateService.ExportTemplateAsDocxAsync(id);
        }

        public async Task<string> SaveTemplateAsDocxToCudAsync(int id, string cudPath)
        {
            return await _emailTemplateService.SaveTemplateAsDocxToCudAsync(id, cudPath);
        }

        public async Task<byte[]> ExportTemplateAsPdfAsync(int id)
        {
            return await _emailTemplateService.ExportTemplateAsPdfAsync(id);
        }
    }
}
