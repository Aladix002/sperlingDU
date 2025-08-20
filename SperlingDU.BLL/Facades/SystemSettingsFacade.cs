using SperlingDU.BLL.DTOs;
using SperlingDU.BLL.Services;

namespace SperlingDU.BLL.Facades
{
    public class SystemSettingsFacade : ISystemSettingsFacade
    {
        private readonly ISystemSettingsService _systemSettingsService;

        public SystemSettingsFacade(ISystemSettingsService systemSettingsService)
        {
            _systemSettingsService = systemSettingsService;
        }

        public async Task<SystemSettingsDto> GetSystemSettingsAsync()
        {
            return await _systemSettingsService.GetSettingsAsync();
        }

        public async Task<SystemSettingsDto> UpdateSystemSettingsAsync(UpdateSystemSettingsDto updateDto)
        {
            var validationErrors = await ValidateSettingsAsync(updateDto);
            if (validationErrors.Any())
            {
                throw new InvalidOperationException($"Validation failed: {string.Join(", ", validationErrors)}");
            }

            var updatedSettings = await _systemSettingsService.UpdateSettingsAsync(updateDto);
            await ApplyBusinessRulesAsync(updatedSettings);
            
            return updatedSettings;
        }

        public async Task<bool> ValidateAndSaveSettingsAsync(UpdateSystemSettingsDto updateDto)
        {
            try
            {
                var validationErrors = await ValidateSettingsAsync(updateDto);
                if (validationErrors.Any())
                {
                    return false;
                }

                await _systemSettingsService.UpdateSettingsAsync(updateDto);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> ResetToDefaultsAsync()
        {
            return await _systemSettingsService.ResetToDefaultsAsync();
        }

        public async Task<List<string>> ValidateSettingsAsync(UpdateSystemSettingsDto settings)
        {
            var errors = new List<string>();

            if (settings.AccountantEmail != null && !IsValidEmail(settings.AccountantEmail))
            {
                errors.Add("Neplatný formát emailové adresy účetní");
            }

            if (settings.CpdFee.HasValue && settings.CpdFee.Value <= 0)
            {
                errors.Add("Poplatek za CPD musí být kladné číslo v Kč");
            }

            if (settings.InvoiceDueDays.HasValue && (settings.InvoiceDueDays.Value < 1 || settings.InvoiceDueDays.Value > 365))
            {
                errors.Add("Splatnost faktur musí být mezi 1 a 365 dny");
            }

            if (settings.PaymentUrgencyDays.HasValue && (settings.PaymentUrgencyDays.Value < 1 || settings.PaymentUrgencyDays.Value > 365))
            {
                errors.Add("Lhůta pro urgenci platby musí být mezi 1 a 365 dny");
            }

            if (settings.PaymentUrgencyPeriodDays.HasValue && (settings.PaymentUrgencyPeriodDays.Value < 1 || settings.PaymentUrgencyPeriodDays.Value > 30))
            {
                errors.Add("Perioda urgence platby musí být mezi 1 a 30 dny");
            }

            if (settings.ActionNotificationDays.HasValue && (settings.ActionNotificationDays.Value < 0 || settings.ActionNotificationDays.Value > 365))
            {
                errors.Add("Lhůta upozornění na akci musí být mezi 0 a 365 dny");
            }

            if (settings.LastActionNotificationHours.HasValue && (settings.LastActionNotificationHours.Value < 0 || settings.LastActionNotificationHours.Value > 8760))
            {
                errors.Add("Lhůta posledního upozornění musí být mezi 0 a 8760 hodinami (1 rok)");
            }

            if (settings.SurveyReminderDays.HasValue && (settings.SurveyReminderDays.Value < 0 || settings.SurveyReminderDays.Value > 365))
            {
                errors.Add("Lhůta pro připomenutí dotazníku musí být mezi 0 a 365 dny");
            }

            if (settings.CpdYearsCount.HasValue && (settings.CpdYearsCount.Value < 1 || settings.CpdYearsCount.Value > 10))
            {
                errors.Add("Počet let součtu CPD musí být mezi 1 a 10 lety");
            }

            if (settings.CpdClosureUrgencyDays.HasValue && (settings.CpdClosureUrgencyDays.Value < 1 || settings.CpdClosureUrgencyDays.Value > 365))
            {
                errors.Add("Lhůta urgence uzávěrky CPD musí být mezi 1 a 365 dny");
            }

            if (settings.CpdClosureUrgencyPeriodDays.HasValue && (settings.CpdClosureUrgencyPeriodDays.Value < 1 || settings.CpdClosureUrgencyPeriodDays.Value > 30))
            {
                errors.Add("Perioda urgence uzávěrky CPD musí být mezi 1 a 30 dny");
            }

            if (settings.InvoiceSeriesIssued != null && !IsValidInvoiceSeries(settings.InvoiceSeriesIssued))
            {
                errors.Add("Číselná řada faktur vydaných musí být ve formátu XrrNNN (např. 324123)");
            }

            if (settings.InvoiceSeriesReceived != null && !IsValidInvoiceSeries(settings.InvoiceSeriesReceived))
            {
                errors.Add("Číselná řada daňových dokladů o přijaté platbě musí být ve formátu XrrNNN (např. 124456)");
            }

            if (settings.InvoiceSeriesSettlement != null && !IsValidInvoiceSeries(settings.InvoiceSeriesSettlement))
            {
                errors.Add("Číselná řada faktur zúčtovacích musí být ve formátu XrrNNN (např. 224789)");
            }

            if (settings.DefaultCertificationYears.HasValue && (settings.DefaultCertificationYears.Value < 1 || settings.DefaultCertificationYears.Value > 10))
            {
                errors.Add("Výchozí doba platnosti certifikace musí být mezi 1 a 10 lety");
            }

            if (settings.CertificationExpiryThresholdDays.HasValue && (settings.CertificationExpiryThresholdDays.Value < 1 || settings.CertificationExpiryThresholdDays.Value > 365))
            {
                errors.Add("Práh expirace certifikace musí být mezi 1 a 365 dny");
            }

            if (settings.DefaultStudentDiscount.HasValue && (settings.DefaultStudentDiscount.Value < 0 || settings.DefaultStudentDiscount.Value > 100))
            {
                errors.Add("Výchozí sleva pro studenty musí být mezi 0% a 100%");
            }

            if (settings.DefaultNonMemberSurcharge.HasValue && (settings.DefaultNonMemberSurcharge.Value < 0 || settings.DefaultNonMemberSurcharge.Value > 100))
            {
                errors.Add("Výchozí přirážka pro nečleny musí být mezi 0% a 100%");
            }

            return errors;
        }

        public async Task<bool> ApplyBusinessRulesAsync(SystemSettingsDto settings)
        {
            try
            {
                if (settings.PaymentUrgencyDays >= settings.InvoiceDueDays)
                {
                    settings.PaymentUrgencyDays = settings.InvoiceDueDays - 1;
                }

                if (settings.CpdClosureUrgencyDays > 90)
                {
                    settings.CpdClosureUrgencyDays = 90;
                }

                if (settings.PaymentUrgencyPeriodDays > settings.PaymentUrgencyDays)
                {
                    settings.PaymentUrgencyPeriodDays = Math.Max(1, settings.PaymentUrgencyDays / 2);
                }

                if (settings.LastActionNotificationHours > settings.ActionNotificationDays * 24)
                {
                    settings.LastActionNotificationHours = settings.ActionNotificationDays * 24;
                }

                if (settings.SurveyReminderDays > settings.PaymentUrgencyDays)
                {
                    settings.SurveyReminderDays = settings.PaymentUrgencyDays;
                }

                if (settings.CertificationExpiryThresholdDays > settings.DefaultCertificationYears * 365)
                {
                    settings.CertificationExpiryThresholdDays = settings.DefaultCertificationYears * 365;
                }

                return true;
            }
            catch
            {
                return false;
            }
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private bool IsValidInvoiceSeries(string series)
        {
            if (string.IsNullOrEmpty(series) || series.Length != 6)
                return false;

            if (!int.TryParse(series[0].ToString(), out int seriesNumber) || seriesNumber < 1 || seriesNumber > 9)
                return false;

            if (!int.TryParse(series.Substring(1, 2), out int year) || year < 0 || year > 99)
                return false;

            if (!int.TryParse(series.Substring(3, 3), out int orderNumber) || orderNumber < 1 || orderNumber > 999)
                return false;

            return true;
        }
    }
}
