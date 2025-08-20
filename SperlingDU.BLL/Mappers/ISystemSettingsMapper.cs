using SperlingDU.BLL.DTOs;
using SperlingDU.DAL.Entities;

namespace SperlingDU.BLL.Mappers
{
    public interface ISystemSettingsMapper
    {
        SystemSettingsDto ToDto(SystemSettings entity);
        void UpdateEntity(SystemSettings entity, UpdateSystemSettingsDto dto);
    }
}
