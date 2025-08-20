using SperlingDU.BLL.DTOs;
using SperlingDU.DAL.Entities;

namespace SperlingDU.BLL.Mappers
{
    public class FileAttachmentMapper : IFileAttachmentMapper
    {
        public FileAttachmentDto ToDto(FileAttachment entity)
        {
            if (entity == null) return null!;

            return new FileAttachmentDto
            {
                Id = entity.Id,
                FileName = entity.FileName,
                CudPath = entity.CudPath,
                FileType = entity.FileType,
                Description = entity.Description,
                FileSize = entity.FileSize,
                UploadDate = entity.UploadDate,
                LastModified = entity.LastModified ?? entity.UploadDate
            };
        }

        public FileAttachment ToEntity(CreateFileAttachmentDto dto)
        {
            if (dto == null) return null!;

            return new FileAttachment
            {
                FileName = dto.FileName,
                CudPath = dto.CudPath,
                FileType = dto.FileType,
                Description = dto.Description,
                FileSize = dto.FileSize,
                UploadDate = DateTime.UtcNow,
                LastModified = DateTime.UtcNow
            };
        }

        public void UpdateEntity(FileAttachment entity, UpdateFileAttachmentDto dto)
        {
            if (entity == null || dto == null) return;

            if (dto.FileName != null)
                entity.FileName = dto.FileName;
            
            if (dto.Description != null)
                entity.Description = dto.Description;

            entity.LastModified = DateTime.UtcNow;
        }
    }
}
