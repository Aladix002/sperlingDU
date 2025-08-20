using SperlingDU.BLL.DTOs;
using FileUploadResponseDto = SperlingDU.BLL.DTOs.FileUploadResponseDto;

namespace SperlingDU.BLL.Facades
{
    public interface IFileAttachmentFacade
    {
        Task<IEnumerable<FileAttachmentDto>> GetAllFilesAsync();
        Task<FileAttachmentDto> GetFileByIdAsync(int id);
        Task<FileAttachmentDto> UploadFileAsync(Stream fileStream, string fileName, string contentType);
        Task<FileUploadResponseDto> UploadFileAsync(FileUploadDto uploadDto);
        Task<FileAttachmentDto> UpdateFileAsync(int id, UpdateFileAttachmentDto updateDto);
        Task<bool> DeleteFileAsync(int id);
        
        Task<FileAttachmentInfoDto> GetFileInfoAsync(int id);
        Task<FileDownloadDto> DownloadFileAsync(int id);
        Task<bool> FileExistsAsync(int id);
        
        Task<IEnumerable<FileAttachmentDto>> GetFilesByTypeAsync(string fileType);
        Task<IEnumerable<FileAttachmentDto>> SearchFilesAsync(string searchTerm);
        
        Task<bool> CanUserAccessFileAsync(int fileId, string userRole);
        Task<Dictionary<string, object>> GetFilesSummaryAsync();
        
        Task<IEnumerable<FileAttachmentDto>> GetAllFileAttachmentsAsync();
        Task<FileAttachmentDto> GetFileAttachmentByIdAsync(int id);
        Task<FileAttachmentDto> CreateFileAttachmentAsync(CreateFileAttachmentDto createDto);
        Task<FileAttachmentDto> UpdateFileAttachmentAsync(int id, UpdateFileAttachmentDto updateDto);
        Task<bool> DeleteFileAttachmentAsync(int id);
        Task<IEnumerable<FileAttachmentDto>> SearchFileAttachmentsAsync(string searchTerm);
        Task<IEnumerable<FileAttachmentDto>> GetFileAttachmentsByTypeAsync(string fileType);
    }
}
