using API.DTOs;

namespace API.Interfaces;

public interface IPhotoService
{
    Task<UploadedPhotoDto?> UploadPhotoAsync(IFormFile file);
}
