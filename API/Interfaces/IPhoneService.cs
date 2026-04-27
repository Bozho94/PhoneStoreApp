using API.DTOs;

namespace API.Interfaces;

public interface IPhoneService
{
    Task<List<PhoneListDto>> GetPhonesAsync();
    Task<List<PhoneListDto>> GetAdminPhonesAsync();
    Task<PhoneDetailsDto?> GetPhoneByIdAsync(int id);
    Task<PhoneDetailsDto> CreatePhoneAsync(PhoneFormDto phoneDto);
    Task<PhoneDetailsDto?> UpdatePhoneAsync(int id, PhoneFormDto phoneDto);
    Task<bool> DeletePhoneAsync(int id);
}
