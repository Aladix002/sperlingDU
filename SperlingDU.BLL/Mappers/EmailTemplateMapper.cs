using SperlingDU.BLL.DTOs;
using SperlingDU.DAL.Entities;

namespace SperlingDU.BLL.Mappers
{
    public class EmailTemplateMapper : IEmailTemplateMapper
    {
        public EmailTemplateDto ToDto(EmailTemplate entity)
        {
            if (entity == null) return null!;

            return new EmailTemplateDto
            {
                Id = entity.Id,
                Name = entity.Name,
                Subject = entity.Subject,
                Body = entity.Body,
                Placeholders = entity.Placeholders,
                TemplateType = entity.TemplateType,
                CreatedAt = entity.CreatedAt,
                LastModified = entity.LastModified
            };
        }

        public EmailTemplate ToEntity(CreateEmailTemplateDto dto)
        {
            if (dto == null) return null!;

            return new EmailTemplate
            {
                Name = dto.Name,
                Subject = dto.Subject,
                Body = dto.Body,
                Placeholders = dto.Placeholders,
                TemplateType = dto.TemplateType,
                CreatedAt = DateTime.UtcNow,
                LastModified = DateTime.UtcNow
            };
        }

        public void UpdateEntity(EmailTemplate entity, UpdateEmailTemplateDto dto)
        {
            if (entity == null || dto == null) return;

            entity.Name = dto.Name;
            entity.Subject = dto.Subject;
            entity.Body = dto.Body;
            entity.Placeholders = dto.Placeholders;
            entity.TemplateType = dto.TemplateType;
            entity.LastModified = DateTime.UtcNow;
        }
    }
}
