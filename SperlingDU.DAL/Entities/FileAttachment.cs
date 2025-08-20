using System.ComponentModel.DataAnnotations;

namespace SperlingDU.DAL.Entities
{
    public class FileAttachment
    {
        [Key]
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
}
