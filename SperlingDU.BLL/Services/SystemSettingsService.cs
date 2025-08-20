using SperlingDU.BLL.DTOs;
using SperlingDU.BLL.Mappers;
using SperlingDU.DAL.Entities;
using SperlingDU.DAL.UnitOfWork;
using System.ComponentModel.DataAnnotations;

namespace SperlingDU.BLL.Services
{
    public class SystemSettingsService : ISystemSettingsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISystemSettingsMapper _mapper;

        public SystemSettingsService(IUnitOfWork unitOfWork, ISystemSettingsMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<SystemSettingsDto> GetSettingsAsync()
        {
            var settings = await _unitOfWork.SystemSettings.GetByIdAsync(1);
            if (settings == null)
            {
                throw new InvalidOperationException("System settings not found. Please ensure database is seeded.");
            }

            var dto = _mapper.ToDto(settings);
            return dto;
        }

        public async Task<SystemSettingsDto> UpdateSettingsAsync(UpdateSystemSettingsDto updateDto)
        {
            var existingSettings = await _unitOfWork.SystemSettings.GetByIdAsync(1);
            if (existingSettings == null)
            {
                throw new InvalidOperationException("System settings not found");
            }

            _mapper.UpdateEntity(existingSettings, updateDto);
            _unitOfWork.SystemSettings.Update(existingSettings);
            await _unitOfWork.SaveAsync();

            var dto = _mapper.ToDto(existingSettings);
            return dto;
        }

        public async Task<bool> ValidateSettingsAsync(SystemSettingsDto settings)
        {
            var validationResults = new List<ValidationResult>();
            var validationContext = new ValidationContext(settings);
            
            if (!Validator.TryValidateObject(settings, validationContext, validationResults, true))
            {
                return false;
            }

            var businessErrors = await ValidateBusinessRulesAsync(settings);
            if (businessErrors.Any())
            {
                return false;
            }

            return true;
        }



        public async Task<bool> ResetToDefaultsAsync()
        {
            var existingSettings = await _unitOfWork.SystemSettings.GetByIdAsync(1);
            
            if (existingSettings == null)
            {
                throw new InvalidOperationException("System settings not found. Please ensure database is seeded.");
            }

            existingSettings.AccountantEmail = "ekonom@vetkom.cz";
            existingSettings.CpdFee = 500;
            existingSettings.InvoiceDueDays = 14;
            existingSettings.PaymentUrgencyDays = 30;
            existingSettings.PaymentUrgencyPeriodDays = 3;
            existingSettings.ActionNotificationDays = 7;
            existingSettings.LastActionNotificationHours = 24;
            existingSettings.SurveyReminderDays = 14;
            existingSettings.CpdYearsCount = 3;
            existingSettings.CpdClosureUrgencyDays = 30;
            existingSettings.CpdClosureUrgencyPeriodDays = 5;
            existingSettings.DefaultCertificationYears = 5;
            existingSettings.CertificationExpiryThresholdDays = 30;
            existingSettings.DefaultStudentDiscount = 30;
            existingSettings.DefaultNonMemberSurcharge = 30;
            
            _unitOfWork.SystemSettings.Update(existingSettings);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<int> CalculateCpdFeeAsync()
        {
            var settings = await GetSettingsAsync();
            return await Task.FromResult(settings.CpdFee);
        }

        public async Task<int> CalculateInvoiceDueDaysAsync()
        {
            var settings = await GetSettingsAsync();
            return await Task.FromResult(settings.InvoiceDueDays);
        }

        public async Task<int> CalculatePaymentUrgencyDaysAsync()
        {
            var settings = await GetSettingsAsync();
            return await Task.FromResult(settings.PaymentUrgencyDays);
        }

        public async Task<string> GenerateInvoiceNumberAsync(string series, int year)
        {
            var yearSuffix = year.ToString().Substring(2);
            var nextNumber = 1;
            return await Task.FromResult($"{series}{yearSuffix}{nextNumber:D3}");
        }

        public async Task<bool> IsCertificationExpiringSoonAsync(DateTime expiryDate)
        {
            var settings = await GetSettingsAsync();
            var thresholdDate = expiryDate.AddDays(-settings.CertificationExpiryThresholdDays);
            return await Task.FromResult(DateTime.Now >= thresholdDate);
        }

        public async Task<decimal> CalculateStudentDiscountAsync(decimal originalPrice)
        {
            var settings = await GetSettingsAsync();
            var discountAmount = originalPrice * (settings.DefaultStudentDiscount / 100m);
            return originalPrice - discountAmount;
        }

        public async Task<decimal> CalculateNonMemberSurchargeAsync(decimal originalPrice)
        {
            var settings = await GetSettingsAsync();
            var surchargeAmount = originalPrice * (settings.DefaultNonMemberSurcharge / 100m);
            return originalPrice + surchargeAmount;
        }

        private async Task<List<string>> ValidateBusinessRulesAsync(SystemSettingsDto settings)
        {
            var errors = new List<string>();

            if (settings.PaymentUrgencyDays >= settings.InvoiceDueDays)
            {
                errors.Add("Lhůta pro urgenci platby musí být menší než splatnost faktur");
            }

            if (settings.CpdClosureUrgencyDays > 90)
            {
                errors.Add("Lhůta urgence uzávěrky CPD nemůže být delší než 90 dní");
            }

            if (settings.DefaultStudentDiscount > 100)
            {
                errors.Add("Sleva pro studenty nemůže přesáhnout 100%");
            }

            if (settings.DefaultNonMemberSurcharge > 100)
            {
                errors.Add("Přirážka pro nečleny nemůže přesáhnout 100%");
            }

            return errors;
        }
    }
}
