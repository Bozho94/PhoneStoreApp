using System.Security.Claims;
using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhonesController (IPhoneService phoneService) : BaseApiController 
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PhoneListItemDto>>> GetPhones()
        {
            var phones = await phoneService.GetPhonesAsync();
            return Ok(phones);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PhoneDetailsDto>> GetPhone(int id)
        {
            var phone = await phoneService.GetPhoneByIdAsync(id);
            if (phone == null) return NotFound();
            return Ok(phone);
        }

        [Authorize]
        [HttpPost("{id}/ratings")]
        public async Task<ActionResult<PhoneRatingResultDto>> AddOrUpdateRating(int id, AddPhoneRatingDto ratingDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var result = await phoneService.AddOrUpdateRatingAsync(id, userId, ratingDto.Rating);
            if (result == null) return NotFound();

            return Ok(result);
        }
    }
}
