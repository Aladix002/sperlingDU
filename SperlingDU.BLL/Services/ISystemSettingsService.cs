using SperlingDU.BLL.DTOs;

namespace SperlingDU.BLL.Services
{
    public interface ISystemSettingsService
    {
        Task<SystemSettingsDto> GetSettingsAsync();
        Task<SystemSettingsDto> UpdateSettingsAsync(UpdateSystemSettingsDto updateDto);
        Task<bool> ValidateSettingsAsync(SystemSettingsDto settings);
        Task<bool> ResetToDefaultsAsync();
        
        Task<int> CalculateCpdFeeAsync();
        Task<int> CalculateInvoiceDueDaysAsync();
        Task<int> CalculatePaymentUrgencyDaysAsync();
        Task<string> GenerateInvoiceNumberAsync(string series, int year);
        Task<bool> IsCertificationExpiringSoonAsync(DateTime expiryDate);
        Task<decimal> CalculateStudentDiscountAsync(decimal originalPrice);
        Task<decimal> CalculateNonMemberSurchargeAsync(decimal originalPrice);
    }
}
