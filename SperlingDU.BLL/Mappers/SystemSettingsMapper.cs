using SperlingDU.BLL.DTOs;
using SperlingDU.DAL.Entities;

namespace SperlingDU.BLL.Mappers
{
    public class SystemSettingsMapper : ISystemSettingsMapper
    {
        public SystemSettingsDto ToDto(SystemSettings entity)
        {
            if (entity == null) return null!;

            return new SystemSettingsDto
            {
                Id = entity.Id,
                AccountantEmail = entity.AccountantEmail,
                CpdFee = entity.CpdFee,
                InvoiceDueDays = entity.InvoiceDueDays,
                PaymentUrgencyDays = entity.PaymentUrgencyDays,
                PaymentUrgencyPeriodDays = entity.PaymentUrgencyPeriodDays,
                ActionNotificationDays = entity.ActionNotificationDays,
                LastActionNotificationHours = entity.LastActionNotificationHours,
                SurveyReminderDays = entity.SurveyReminderDays,
                CpdYearsCount = entity.CpdYearsCount,
                CpdClosureUrgencyDays = entity.CpdClosureUrgencyDays,
                CpdClosureUrgencyPeriodDays = entity.CpdClosureUrgencyPeriodDays,
                InvoiceSeriesIssued = entity.InvoiceSeriesIssued,
                InvoiceSeriesReceived = entity.InvoiceSeriesReceived,
                InvoiceSeriesSettlement = entity.InvoiceSeriesSettlement,
                DefaultCertificationYears = entity.DefaultCertificationYears,
                CertificationExpiryThresholdDays = entity.CertificationExpiryThresholdDays,
                InfoBox = entity.InfoBox,
                DefaultStudentDiscount = entity.DefaultStudentDiscount,
                DefaultNonMemberSurcharge = entity.DefaultNonMemberSurcharge
            };
        }



        public void UpdateEntity(SystemSettings entity, UpdateSystemSettingsDto dto)
        {
            if (entity == null || dto == null) return;

            if (dto.AccountantEmail != null)
                entity.AccountantEmail = dto.AccountantEmail;
            
            if (dto.CpdFee.HasValue)
                entity.CpdFee = dto.CpdFee.Value;
            
            if (dto.InvoiceDueDays.HasValue)
                entity.InvoiceDueDays = dto.InvoiceDueDays.Value;
            
            if (dto.PaymentUrgencyDays.HasValue)
                entity.PaymentUrgencyDays = dto.PaymentUrgencyDays.Value;
            
            if (dto.PaymentUrgencyPeriodDays.HasValue)
                entity.PaymentUrgencyPeriodDays = dto.PaymentUrgencyPeriodDays.Value;
            
            if (dto.ActionNotificationDays.HasValue)
                entity.ActionNotificationDays = dto.ActionNotificationDays.Value;
            
            if (dto.LastActionNotificationHours.HasValue)
                entity.LastActionNotificationHours = dto.LastActionNotificationHours.Value;
            
            if (dto.SurveyReminderDays.HasValue)
                entity.SurveyReminderDays = dto.SurveyReminderDays.Value;
            
            if (dto.CpdYearsCount.HasValue)
                entity.CpdYearsCount = dto.CpdYearsCount.Value;
            
            if (dto.CpdClosureUrgencyDays.HasValue)
                entity.CpdClosureUrgencyDays = dto.CpdClosureUrgencyDays.Value;
            
            if (dto.CpdClosureUrgencyPeriodDays.HasValue)
                entity.CpdClosureUrgencyPeriodDays = dto.CpdClosureUrgencyPeriodDays.Value;
            
            if (dto.InvoiceSeriesIssued != null)
                entity.InvoiceSeriesIssued = dto.InvoiceSeriesIssued;
            
            if (dto.InvoiceSeriesReceived != null)
                entity.InvoiceSeriesReceived = dto.InvoiceSeriesReceived;
            
            if (dto.InvoiceSeriesSettlement != null)
                entity.InvoiceSeriesSettlement = dto.InvoiceSeriesSettlement;
            
            if (dto.DefaultCertificationYears.HasValue)
                entity.DefaultCertificationYears = dto.DefaultCertificationYears.Value;
            
            if (dto.CertificationExpiryThresholdDays.HasValue)
                entity.CertificationExpiryThresholdDays = dto.CertificationExpiryThresholdDays.Value;
            
            if (dto.InfoBox != null)
                entity.InfoBox = dto.InfoBox;
            
            if (dto.DefaultStudentDiscount.HasValue)
                entity.DefaultStudentDiscount = dto.DefaultStudentDiscount.Value;
            
            if (dto.DefaultNonMemberSurcharge.HasValue)
                entity.DefaultNonMemberSurcharge = dto.DefaultNonMemberSurcharge.Value;
        }
    }
}
