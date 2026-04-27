using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Roles = "Admin")]
public class PhotosController(IPhotoService photoService) : BaseApiController
{
    [HttpPost("upload")]
    public async Task<ActionResult<UploadedPhotoDto>> UploadPhoto([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("Please select an image.");
        }

        var result = await photoService.UploadPhotoAsync(file);

        if (result == null)
        {
            return BadRequest("Could not upload image.");
        }

        return Ok(result);
    }
}
