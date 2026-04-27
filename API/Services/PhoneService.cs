using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class PhoneService(AppDbContext context) : IPhoneService
{
    public async Task<List<PhoneListDto>> GetPhonesAsync()
    {
        return await BuildPhoneListQuery().ToListAsync();
    }

    public async Task<List<PhoneListDto>> GetAdminPhonesAsync()
    {
        return await BuildPhoneListQuery().ToListAsync();
    }

    public async Task<PhoneDetailsDto?> GetPhoneByIdAsync(int id)
    {
        return await context.Phones
            .AsNoTracking()
            .Where(p => p.Id == id)
            .Select(p => new PhoneDetailsDto
            {
                Id = p.Id,
                Brand = p.Brand,
                Model = p.Model,
                ReleaseYear = p.ReleaseYear,
                Price = p.Price,
                Description = p.Description,
                StockQuantity = p.StockQuantity,
                Images = p.Images
                    .Select(i => new PhoneImageDto
                    {
                        Id = i.Id,
                        ImageUrl = i.ImageUrl,
                        PublicId = i.PublicId,
                        IsMain = i.IsMain
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<PhoneDetailsDto> CreatePhoneAsync(PhoneFormDto phoneDto)
    {
        var phone = new Phone
        {
            CreatedAt = DateTime.UtcNow,
            Images = BuildPhoneImages(phoneDto.Images)
        };

        ApplyPhoneChanges(phone, phoneDto);
        context.Phones.Add(phone);
        await context.SaveChangesAsync();

        return await GetPhoneByIdAsync(phone.Id)
            ?? throw new InvalidOperationException("Phone was created but could not be loaded.");
    }

    public async Task<PhoneDetailsDto?> UpdatePhoneAsync(int id, PhoneFormDto phoneDto)
    {
        var phone = await context.Phones
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (phone == null) return null;

        ApplyPhoneChanges(phone, phoneDto);
        MarkImagesAsDeleted(phone.Images);
        phone.Images.AddRange(BuildPhoneImages(phoneDto.Images));

        await context.SaveChangesAsync();

        return await GetPhoneByIdAsync(phone.Id);
    }

    public async Task<bool> DeletePhoneAsync(int id)
    {
        var phone = await context.Phones
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (phone == null) return false;

        phone.IsDeleted = true;
        MarkImagesAsDeleted(phone.Images);
        await context.SaveChangesAsync();

        return true;
    }

    private static void ApplyPhoneChanges(Phone phone, PhoneFormDto phoneDto)
    {
        phone.Brand = phoneDto.Brand;
        phone.Model = phoneDto.Model;
        phone.ReleaseYear = phoneDto.ReleaseYear;
        phone.Price = phoneDto.Price;
        phone.Description = phoneDto.Description;
        phone.StockQuantity = phoneDto.StockQuantity;
    }

    private static void MarkImagesAsDeleted(IEnumerable<PhoneImage> images)
    {
        foreach (var image in images)
        {
            image.IsDeleted = true;
        }
    }

    private static List<PhoneImage> BuildPhoneImages(List<PhoneImageFormDto> imageDtos)
    {
        var images = imageDtos
            .Where(i => !string.IsNullOrWhiteSpace(i.ImageUrl))
            .Select(i => new PhoneImage
            {
                ImageUrl = i.ImageUrl.Trim(),
                PublicId = i.PublicId,
                IsMain = i.IsMain
            })
            .ToList();

        if (images.Count == 0) return images;

        var hasMainImage = false;

        foreach (var image in images)
        {
            if (image.IsMain && !hasMainImage)
            {
                hasMainImage = true;
            }
            else
            {
                image.IsMain = false;
            }
        }

        if (!hasMainImage)
        {
            images[0].IsMain = true;
        }

        return images;
    }

    private IQueryable<PhoneListDto> BuildPhoneListQuery()
    {
        return context.Phones
            .AsNoTracking()
            .OrderBy(phone => phone.Price)
            .ThenBy(phone => phone.Brand)
            .ThenBy(phone => phone.Model)
            .Select(p => new PhoneListDto
            {
                Id = p.Id,
                Brand = p.Brand,
                Model = p.Model,
                ReleaseYear = p.ReleaseYear,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                MainImageUrl = p.Images
                    .Where(i => i.IsMain)
                    .Select(i => i.ImageUrl)
                    .FirstOrDefault() ?? string.Empty
            });
    }
}
