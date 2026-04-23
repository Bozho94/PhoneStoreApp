using API.DTOs;

namespace API.Interfaces;

public interface IPhoneService
{
    Task<IEnumerable<PhoneListItemDto>> GetPhonesAsync();
    Task<PhoneDetailsDto?> GetPhoneByIdAsync(int id);
    Task<PhoneRatingResultDto?> AddOrUpdateRatingAsync(int phoneId, string userId, int rating);
}
