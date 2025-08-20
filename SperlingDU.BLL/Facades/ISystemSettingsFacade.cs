using SperlingDU.BLL.DTOs;

namespace SperlingDU.BLL.Facades
{
    public interface ISystemSettingsFacade
    {
        Task<SystemSettingsDto> GetSystemSettingsAsync();
        Task<SystemSettingsDto> UpdateSystemSettingsAsync(UpdateSystemSettingsDto updateDto);
        Task<bool> ValidateAndSaveSettingsAsync(UpdateSystemSettingsDto updateDto);
        
        Task<bool> ResetToDefaultsAsync();
        
        Task<List<string>> ValidateSettingsAsync(UpdateSystemSettingsDto settings);
        Task<bool> ApplyBusinessRulesAsync(SystemSettingsDto settings);
    }
}
