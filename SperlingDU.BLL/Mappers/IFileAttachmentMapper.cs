using SperlingDU.BLL.DTOs;
using SperlingDU.DAL.Entities;

namespace SperlingDU.BLL.Mappers
{
    public interface IFileAttachmentMapper
    {
        FileAttachmentDto ToDto(FileAttachment entity);
        FileAttachment ToEntity(CreateFileAttachmentDto dto);
        void UpdateEntity(FileAttachment entity, UpdateFileAttachmentDto dto);
    }
}
