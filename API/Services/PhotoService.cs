using API.DTOs;
using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace API.Services;

public class PhotoService(IConfiguration config) : IPhotoService
{
    private readonly Cloudinary? cloudinary = CreateCloudinary(config);

    public async Task<UploadedPhotoDto?> UploadPhotoAsync(IFormFile file)
    {
        if (cloudinary == null) return null;

        await using var stream = file.OpenReadStream();

        var uploadResult = await cloudinary.UploadAsync(new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = "phone-store"
        });

        if (uploadResult.Error != null || uploadResult.SecureUrl == null)
        {
            return null;
        }

        return new UploadedPhotoDto
        {
            ImageUrl = uploadResult.SecureUrl.ToString(),
            PublicId = uploadResult.PublicId
        };
    }

    private static Cloudinary? CreateCloudinary(IConfiguration config)
    {
        var cloudName = config["Cloudinary:CloudName"];
        var apiKey = config["Cloudinary:ApiKey"];
        var apiSecret = config["Cloudinary:ApiSecret"];

        if (string.IsNullOrWhiteSpace(cloudName) ||
            string.IsNullOrWhiteSpace(apiKey) ||
            string.IsNullOrWhiteSpace(apiSecret))
        {
            return null;
        }

        return new Cloudinary(new Account(cloudName, apiKey, apiSecret));
    }
}
