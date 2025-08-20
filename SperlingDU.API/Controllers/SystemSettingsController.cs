using Microsoft.AspNetCore.Mvc;
using SperlingDU.BLL.DTOs;
using SperlingDU.BLL.Facades;

namespace SperlingDU.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SystemSettingsController : ControllerBase
    {
        private readonly ISystemSettingsFacade _systemSettingsFacade;

        public SystemSettingsController(ISystemSettingsFacade systemSettingsFacade)
        {
            _systemSettingsFacade = systemSettingsFacade;
        }

        [HttpGet]
        public async Task<ActionResult<SystemSettingsDto>> GetSystemSettings()
        {
            try
            {
                var settings = await _systemSettingsFacade.GetSystemSettingsAsync();
                return Ok(settings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut]
        public async Task<ActionResult<SystemSettingsDto>> UpdateSystemSettings([FromBody] UpdateSystemSettingsDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState
                        .Where(x => x.Value.Errors.Count > 0)
                        .SelectMany(x => x.Value.Errors)
                        .Select(x => x.ErrorMessage)
                        .ToList();
                    
                    return BadRequest(new { errors });
                }

                var updatedSettings = await _systemSettingsFacade.UpdateSystemSettingsAsync(updateDto);
                return Ok(updatedSettings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("validate")]
        public async Task<ActionResult<List<string>>> ValidateSystemSettings([FromBody] UpdateSystemSettingsDto settings)
        {
            try
            {
                var errors = await _systemSettingsFacade.ValidateSettingsAsync(settings);
                return Ok(errors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("reset")]
        public async Task<ActionResult<bool>> ResetToDefaults()
        {
            try
            {
                var success = await _systemSettingsFacade.ResetToDefaultsAsync();
                return Ok(success);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
