using SperlingDU.BLL.DTOs;
using SperlingDU.BLL.Services;

namespace SperlingDU.BLL.Facades
{
    public class FileAttachmentFacade : IFileAttachmentFacade
    {
        private readonly IFileAttachmentService _fileAttachmentService;

        public FileAttachmentFacade(IFileAttachmentService fileAttachmentService)
        {
            _fileAttachmentService = fileAttachmentService;
        }

        public async Task<IEnumerable<FileAttachmentDto>> GetAllFilesAsync()
        {
            return await _fileAttachmentService.GetAllFilesAsync();
        }

        public async Task<FileAttachmentDto> GetFileByIdAsync(int id)
        {
            return await _fileAttachmentService.GetFileByIdAsync(id);
        }

        public async Task<FileAttachmentDto> UploadFileAsync(Stream fileStream, string fileName, string contentType)
        {
            return await _fileAttachmentService.UploadFileAsync(fileStream, fileName, contentType);
        }

        public async Task<FileUploadResponseDto> UploadFileAsync(FileUploadDto uploadDto)
        {
            var createDto = new CreateFileAttachmentDto
            {
                FileName = uploadDto.FileName,
                FileType = uploadDto.ContentType,
                FileSize = uploadDto.FileSize,
                Description = uploadDto.Description ?? string.Empty,
                CudPath = uploadDto.CudPath
            };

            var fileAttachment = await _fileAttachmentService.CreateFileAsync(createDto);

            return new FileUploadResponseDto
            {
                Id = fileAttachment.Id,
                FileName = fileAttachment.FileName,
                FileType = fileAttachment.FileType,
                FileSize = fileAttachment.FileSize,
                CudPath = fileAttachment.CudPath,
                Description = fileAttachment.Description,
                UploadDate = fileAttachment.UploadDate
            };
        }

        public async Task<FileAttachmentDto> UpdateFileAsync(int id, UpdateFileAttachmentDto updateDto)
        {
            return await _fileAttachmentService.UpdateFileAsync(id, updateDto);
        }

        public async Task<bool> DeleteFileAsync(int id)
        {
            return await _fileAttachmentService.DeleteFileAsync(id);
        }

        public async Task<FileAttachmentInfoDto> GetFileInfoAsync(int id)
        {
            var file = await _fileAttachmentService.GetFileByIdAsync(id);
            if (file == null) return null!;

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

        // New method for downloading files that returns FileDownloadDto
        public async Task<FileDownloadDto> DownloadFileAsync(int id)
        {
            var file = await _fileAttachmentService.GetFileByIdAsync(id);
            if (file == null)
            {
                throw new InvalidOperationException("File not found");
            }

            // Return basic file information - actual content will be loaded by API layer
            return new FileDownloadDto
            {
                FileName = file.FileName,
                ContentType = file.FileType,
                FileContent = Array.Empty<byte>() // Content will be loaded by API layer from CUD
            };
        }

        public async Task<bool> FileExistsAsync(int id)
        {
            var file = await _fileAttachmentService.GetFileByIdAsync(id);
            return file != null;
        }

        public async Task<IEnumerable<FileAttachmentDto>> GetFilesByTypeAsync(string fileType)
        {
            var allFiles = await _fileAttachmentService.GetAllFilesAsync();
            return allFiles.Where(f => f.FileType.Contains(fileType, StringComparison.OrdinalIgnoreCase));
        }

        public async Task<IEnumerable<FileAttachmentDto>> SearchFilesAsync(string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm))
                return await _fileAttachmentService.GetAllFilesAsync();

            var allFiles = await _fileAttachmentService.GetAllFilesAsync();
            return allFiles.Where(f => 
                f.FileName.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                f.Description.Contains(searchTerm, StringComparison.OrdinalIgnoreCase));
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
            var allFiles = await _fileAttachmentService.GetAllFilesAsync();
            
            return new Dictionary<string, object>
            {
                ["TotalFiles"] = allFiles.Count(),
                ["PdfFiles"] = allFiles.Count(f => f.FileType.Contains("pdf")),
                ["TotalSize"] = allFiles.Sum(f => f.FileSize)
            };
        }

        // Additional methods needed by the controller
        public async Task<IEnumerable<FileAttachmentDto>> GetAllFileAttachmentsAsync()
        {
            return await GetAllFilesAsync();
        }

        public async Task<FileAttachmentDto> GetFileAttachmentByIdAsync(int id)
        {
            return await GetFileByIdAsync(id);
        }

        public async Task<FileAttachmentDto> CreateFileAttachmentAsync(CreateFileAttachmentDto createDto)
        {
            return await _fileAttachmentService.CreateFileAsync(createDto);
        }

        public async Task<FileAttachmentDto> UpdateFileAttachmentAsync(int id, UpdateFileAttachmentDto updateDto)
        {
            return await UpdateFileAsync(id, updateDto);
        }

        public async Task<bool> DeleteFileAttachmentAsync(int id)
        {
            return await DeleteFileAsync(id);
        }

        public async Task<IEnumerable<FileAttachmentDto>> SearchFileAttachmentsAsync(string searchTerm)
        {
            return await SearchFilesAsync(searchTerm);
        }

        public async Task<IEnumerable<FileAttachmentDto>> GetFileAttachmentsByTypeAsync(string fileType)
        {
            return await GetFilesByTypeAsync(fileType);
        }
    }
}
