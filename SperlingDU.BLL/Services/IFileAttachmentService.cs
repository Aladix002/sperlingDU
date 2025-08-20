using SperlingDU.BLL.DTOs;

namespace SperlingDU.BLL.Services
{
    public interface IFileAttachmentService
    {
        Task<FileAttachmentDto> GetFileByIdAsync(int id);
        Task<IEnumerable<FileAttachmentDto>> GetAllFilesAsync();
        Task<FileAttachmentDto> CreateFileAsync(CreateFileAttachmentDto createDto);
        Task<FileAttachmentDto> UpdateFileAsync(int id, UpdateFileAttachmentDto updateDto);
        Task<bool> DeleteFileAsync(int id);
        
        // Business logic methods
        Task<FileAttachmentDto> UploadFileAsync(Stream fileStream, string fileName, string contentType);
        Task<FileUploadResponseDto> UploadFileAsync(FileUploadDto uploadDto);
        Task<FileDownloadDto> DownloadFileAsync(int id);
        Task<bool> ValidateFileTypeAsync(string fileName, string contentType);
        Task<long> GetFileSizeAsync(int id);
        Task<FileAttachmentInfoDto> GetFileInfoAsync(int id);
        Task<bool> FileExistsAsync(int id);
        Task<bool> CanUserAccessFileAsync(int fileId, string userRole);
        Task<Dictionary<string, object>> GetFilesSummaryAsync();
    }
}
