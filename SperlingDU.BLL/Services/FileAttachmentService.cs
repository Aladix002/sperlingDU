using SperlingDU.BLL.DTOs;
using SperlingDU.BLL.Mappers;
using SperlingDU.DAL.Entities;
using SperlingDU.DAL.UnitOfWork;

namespace SperlingDU.BLL.Services
{
    public class FileAttachmentService : IFileAttachmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileAttachmentMapper _mapper;

        public FileAttachmentService(IUnitOfWork unitOfWork, IFileAttachmentMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<FileAttachmentDto>> GetAllFilesAsync()
        {
            var files = await _unitOfWork.FileAttachments.GetAllAsync();
            return files.Select(f => _mapper.ToDto(f));
        }

        public async Task<FileAttachmentDto> GetFileByIdAsync(int id)
        {
            var file = await _unitOfWork.FileAttachments.GetByIdAsync(id);
            return file != null ? _mapper.ToDto(file) : null!;
        }

        public async Task<FileAttachmentDto> CreateFileAsync(CreateFileAttachmentDto createDto)
        {
            var entity = _mapper.ToEntity(createDto);
            
            entity.UploadDate = DateTime.UtcNow;
            entity.LastModified = DateTime.UtcNow;
            
            await _unitOfWork.FileAttachments.AddAsync(entity);
            await _unitOfWork.SaveAsync();

            return _mapper.ToDto(entity);
        }

        public async Task<FileAttachmentDto> UploadFileAsync(Stream fileStream, string fileName, string contentType)
        {
            throw new NotImplementedException("Use UploadFileAsync(FileUploadDto) method instead");
        }

        public async Task<FileUploadResponseDto> UploadFileAsync(FileUploadDto uploadDto)
        {
            var entity = new FileAttachment
            {
                FileName = uploadDto.FileName,
                FileType = uploadDto.ContentType,
                CudPath = uploadDto.CudPath,
                Description = uploadDto.Description ?? $"Uploaded file: {uploadDto.FileName}",
                FileSize = uploadDto.FileSize,
                UploadDate = DateTime.UtcNow,
                LastModified = DateTime.UtcNow
            };

            await _unitOfWork.FileAttachments.AddAsync(entity);
            await _unitOfWork.SaveAsync();

            return new FileUploadResponseDto
            {
                Id = entity.Id,
                FileName = entity.FileName,
                FileType = entity.FileType,
                FileSize = entity.FileSize,
                CudPath = entity.CudPath,
                Description = entity.Description,
                UploadDate = entity.UploadDate
            };
        }

        public async Task<FileAttachmentDto> UpdateFileAsync(int id, UpdateFileAttachmentDto updateDto)
        {
            var existingFile = await _unitOfWork.FileAttachments.GetByIdAsync(id);
            if (existingFile == null)
            {
                throw new InvalidOperationException("File not found");
            }

            _mapper.UpdateEntity(existingFile, updateDto);
            existingFile.LastModified = DateTime.UtcNow;
            _unitOfWork.FileAttachments.Update(existingFile);
            await _unitOfWork.SaveAsync();

            return _mapper.ToDto(existingFile);
        }

        public async Task<bool> DeleteFileAsync(int id)
        {
            var file = await _unitOfWork.FileAttachments.GetByIdAsync(id);
            if (file == null)
            {
                return false;
            }

            _unitOfWork.FileAttachments.Remove(file);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<FileDownloadDto> DownloadFileAsync(int id)
        {
            var file = await _unitOfWork.FileAttachments.GetByIdAsync(id);
            if (file == null)
            {
                throw new InvalidOperationException("File not found");
            }

            return new FileDownloadDto
            {
                FileName = file.FileName,
                ContentType = file.FileType,
                FileContent = Array.Empty<byte>()
            };
        }

        public async Task<bool> ValidateFileTypeAsync(string fileName, string contentType)
        {
            var allowedTypes = new[] { "application/pdf" };
            return allowedTypes.Contains(contentType);
        }

        public async Task<long> GetFileSizeAsync(int id)
        {
            var file = await _unitOfWork.FileAttachments.GetByIdAsync(id);
            if (file == null)
            {
                return 0;
            }

            return file.FileSize; 
        }

        public async Task<FileAttachmentInfoDto> GetFileInfoAsync(int id)
        {
            var file = await _unitOfWork.FileAttachments.GetByIdAsync(id);
            if (file == null)
            {
                return null!;
            }

            return new FileAttachmentInfoDto
            {
                Id = file.Id,
                FileName = file.FileName,
                FileType = file.FileType,
                FileSize = file.FileSize,
                UploadDate = file.UploadDate,
                Description = file.Description
            };
        }

        public async Task<bool> FileExistsAsync(int id)
        {
            var file = await _unitOfWork.FileAttachments.GetByIdAsync(id);
            return file != null;
        }

        public async Task<bool> CanUserAccessFileAsync(int fileId, string userRole)
        {
            return userRole switch
            {
                "Administrator" => true,
                "EventManager" => true,
                _ => false
            };
        }

        public async Task<Dictionary<string, object>> GetFilesSummaryAsync()
        {
            var allFiles = await _unitOfWork.FileAttachments.GetAllAsync();
            
            return new Dictionary<string, object>
            {
                ["TotalFiles"] = allFiles.Count(),
                ["PdfFiles"] = allFiles.Count(f => f.FileType.Contains("pdf")),
                ["TotalSize"] = allFiles.Sum(f => f.FileSize)
            };
        }
    }
}
