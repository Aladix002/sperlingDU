using System.ComponentModel.DataAnnotations;

namespace SperlingDU.BLL.DTOs
{
    public class SystemSettingsDto
    {
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string AccountantEmail { get; set; } = string.Empty;

        [Required]
        [Range(1, int.MaxValue)]
        public int CpdFee { get; set; }

        [Required]
        [Range(1, 365)]
        public int InvoiceDueDays { get; set; }

        [Required]
        [Range(1, 365)]
        public int PaymentUrgencyDays { get; set; }

        [Required]
        [Range(1, 30)]
        public int PaymentUrgencyPeriodDays { get; set; }

        [Required]
        [Range(0, 365)]
        public int ActionNotificationDays { get; set; }

        [Required]
        [Range(0, 8760)]
        public int LastActionNotificationHours { get; set; }

        [Required]
        [Range(0, 365)]
        public int SurveyReminderDays { get; set; }

        [Required]
        [Range(1, 10)]
        public int CpdYearsCount { get; set; }

        [Required]
        [Range(1, 365)]
        public int CpdClosureUrgencyDays { get; set; }

        [Required]
        [Range(1, 30)]
        public int CpdClosureUrgencyPeriodDays { get; set; }

        [Required]
        [RegularExpression(@"^[1-9][0-9]{5}$")]
        public string InvoiceSeriesIssued { get; set; } = string.Empty;

        [Required]
        [RegularExpression(@"^[1-9][0-9]{5}$")]
        public string InvoiceSeriesReceived { get; set; } = string.Empty;

        [Required]
        [RegularExpression(@"^[1-9][0-9]{5}$")]
        public string InvoiceSeriesSettlement { get; set; } = string.Empty;

        [Required]
        [Range(1, 10)]
        public int DefaultCertificationYears { get; set; }

        [Required]
        [Range(1, 365)]
        public int CertificationExpiryThresholdDays { get; set; }

        [Required]
        public string InfoBox { get; set; } = string.Empty;

        [Required]
        [Range(0, 100)]
        public int DefaultStudentDiscount { get; set; }

        [Required]
        [Range(0, 100)]
        public int DefaultNonMemberSurcharge { get; set; }
    }

    public class UpdateSystemSettingsDto
    {
        [EmailAddress]
        public string? AccountantEmail { get; set; }

        [Range(0, int.MaxValue)]
        public int? CpdFee { get; set; }

        [Range(1, 365)]
        public int? InvoiceDueDays { get; set; }

        [Range(1, 365)]
        public int? PaymentUrgencyDays { get; set; }

        [Range(1, 365)]
        public int? PaymentUrgencyPeriodDays { get; set; }

        [Range(0, 365)]
        public int? ActionNotificationDays { get; set; }

        [Range(0, 8760)]
        public int? LastActionNotificationHours { get; set; }

        [Range(0, 365)]
        public int? SurveyReminderDays { get; set; }

        [Range(1, 10)]
        public int? CpdYearsCount { get; set; }

        [Range(1, 365)]
        public int? CpdClosureUrgencyDays { get; set; }

        [Range(1, 365)]
        public int? CpdClosureUrgencyPeriodDays { get; set; }

        public string? InvoiceSeriesIssued { get; set; }
        public string? InvoiceSeriesReceived { get; set; }
        public string? InvoiceSeriesSettlement { get; set; }

        [Range(1, 10)]
        public int? DefaultCertificationYears { get; set; }

        [Range(1, 365)]
        public int? CertificationExpiryThresholdDays { get; set; }

        public string? InfoBox { get; set; }

        [Range(0, 100)]
        public int? DefaultStudentDiscount { get; set; }

        [Range(0, 100)]
        public int? DefaultNonMemberSurcharge { get; set; }
    }

    public class SystemSettingsValidationDto
    {
        public List<string> Errors { get; set; } = new List<string>();
        public List<string> Warnings { get; set; } = new List<string>();
        public bool IsValid { get; set; }
        public Dictionary<string, object> CalculatedValues { get; set; } = new Dictionary<string, object>();
    }

    public class SystemSettingsCalculationDto
    {
        public int CalculatedCpdFee { get; set; }
        public int CalculatedInvoiceDueDays { get; set; }
        public int CalculatedPaymentUrgencyDays { get; set; }
        public decimal CalculatedStudentDiscount { get; set; }
        public decimal CalculatedNonMemberSurcharge { get; set; }
        public string NextInvoiceNumber { get; set; } = string.Empty;
        public DateTime NextCpdClosureDate { get; set; }
    }

    public class SystemSettingsBackupDto
    {
        public DateTime BackupDate { get; set; }
        public string BackupVersion { get; set; } = string.Empty;
        public SystemSettingsDto Settings { get; set; } = null!;
        public string BackupNotes { get; set; } = string.Empty;
    }
}
