using System.ComponentModel.DataAnnotations;

namespace SperlingDU.DAL.Entities
{
    public class SystemSettings
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string AccountantEmail { get; set; }

        [Required]
        public int CpdFee { get; set; }
        
        [Required]
        public int InvoiceDueDays { get; set; }
        
        [Required]
        public int PaymentUrgencyDays { get; set; }
        
        [Required]
        public int PaymentUrgencyPeriodDays { get; set; }
        
        [Required]
        public int ActionNotificationDays { get; set; }
        
        [Required]
        public int LastActionNotificationHours { get; set; }
        
        [Required]
        public int SurveyReminderDays { get; set; }
        
        [Required]
        public int CpdYearsCount { get; set; }
        
        [Required]
        public int CpdClosureUrgencyDays { get; set; }
        
        [Required]
        public int CpdClosureUrgencyPeriodDays { get; set; }
        
        [Required]
        public string InvoiceSeriesIssued { get; set; }
        
        [Required]
        public string InvoiceSeriesReceived { get; set; }
        
        [Required]
        public string InvoiceSeriesSettlement { get; set; }
        
        [Required]
        public int DefaultCertificationYears { get; set; }
        
        [Required]
        public int CertificationExpiryThresholdDays { get; set; }
        
        [Required]
        public string InfoBox { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int DefaultStudentDiscount { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int DefaultNonMemberSurcharge { get; set; }
    }
}

