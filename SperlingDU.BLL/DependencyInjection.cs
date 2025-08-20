using Microsoft.Extensions.DependencyInjection;
using SperlingDU.BLL.Facades;
using SperlingDU.BLL.Mappers;
using SperlingDU.BLL.Services;

namespace SperlingDU.BLL
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddBLLServices(this IServiceCollection services)
        {
            services.AddScoped<ISystemSettingsService, SystemSettingsService>();
            services.AddScoped<IFileAttachmentService, FileAttachmentService>();
            services.AddScoped<IEmailTemplateService, EmailTemplateService>();

            services.AddScoped<ISystemSettingsFacade, SystemSettingsFacade>();
            services.AddScoped<IFileAttachmentFacade, FileAttachmentFacade>();
            services.AddScoped<IEmailTemplateFacade, EmailTemplateFacade>();

            services.AddScoped<ISystemSettingsMapper, SystemSettingsMapper>();
            services.AddScoped<IFileAttachmentMapper, FileAttachmentMapper>();
            services.AddScoped<IEmailTemplateMapper, EmailTemplateMapper>();

            return services;
        }
    }
}
