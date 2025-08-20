using SperlingDU.BLL.DTOs;
using SperlingDU.DAL.Entities;

namespace SperlingDU.BLL.Mappers
{
    public interface IEmailTemplateMapper
    {
        EmailTemplateDto ToDto(EmailTemplate entity);
        EmailTemplate ToEntity(CreateEmailTemplateDto dto);
        void UpdateEntity(EmailTemplate entity, UpdateEmailTemplateDto dto);
    }
}
