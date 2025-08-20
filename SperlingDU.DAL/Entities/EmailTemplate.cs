using System.ComponentModel.DataAnnotations;

namespace SperlingDU.DAL.Entities
{
    public class EmailTemplate
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Subject { get; set; } = string.Empty;

        [Required]
        public string Body { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Placeholders { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string TemplateType { get; set; } = "notification"; 

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastModified { get; set; }
    }
}
