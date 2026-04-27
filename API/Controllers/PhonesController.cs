using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhonesController(IPhoneService phoneService) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<PhoneListDto>>> GetPhones()
        {
            var phones = await phoneService.GetPhonesAsync();
            return Ok(phones);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<PhoneDetailsDto>> GetPhone(int id)
        {
            var phone = await phoneService.GetPhoneByIdAsync(id);
            if (phone == null) return NotFound();
            return Ok(phone);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<PhoneDetailsDto>> CreatePhone(PhoneFormDto phoneDto)
        {
            var phone = await phoneService.CreatePhoneAsync(phoneDto);
            return CreatedAtAction(nameof(GetPhone), new { id = phone.Id }, phone);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<PhoneDetailsDto>> UpdatePhone(int id, PhoneFormDto phoneDto)
        {
            var phone = await phoneService.UpdatePhoneAsync(id, phoneDto);
            if (phone == null) return NotFound();

            return Ok(phone);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhone(int id)
        {
            var deleted = await phoneService.DeletePhoneAsync(id);
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}
