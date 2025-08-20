using System.ComponentModel.DataAnnotations;

namespace SperlingDU.BLL.DTOs
{
    public class FileAttachmentDto
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string FileName { get; set; } = string.Empty;

        [Required]
        public string CudPath { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string FileType { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public long FileSize { get; set; }
        public DateTime UploadDate { get; set; }
        public DateTime? LastModified { get; set; }
    }

    public class CreateFileAttachmentDto
    {
        [Required]
        [MaxLength(255)]
        public string FileName { get; set; } = string.Empty;

        [Required]
        public string CudPath { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string FileType { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;
        public long FileSize { get; set; }
    }

    public class UpdateFileAttachmentDto
    {
        [MaxLength(255)]
        public string? FileName { get; set; }

        public string? Description { get; set; }
    }

    public class FileAttachmentInfoDto
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public DateTime UploadDate { get; set; }
    }

    public class FileUploadDto
    {
        [Required]
        public string FileName { get; set; } = string.Empty;
        
        [Required]
        public string ContentType { get; set; } = string.Empty;
        
        [Required]
        public long FileSize { get; set; }
        
        public string? Description { get; set; }
        public string CudPath { get; set; } = string.Empty;
    }

    public class FileUploadResponseDto
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string CudPath { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime UploadDate { get; set; }
    }

    public class FileSearchDto
    {
        public string? SearchTerm { get; set; }
        public string? FileType { get; set; }
        public DateTime? UploadedFrom { get; set; }
        public DateTime? UploadedTo { get; set; }
        public long? MinFileSize { get; set; }
        public long? MaxFileSize { get; set; }
    }

    public class FileBulkOperationDto
    {
        public List<int> FileIds { get; set; } = new List<int>();
        public string Operation { get; set; } = string.Empty; // "delete", "archive"
    }

    public class FileDownloadDto
    {
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public byte[] FileContent { get; set; } = Array.Empty<byte>();
    }
}
