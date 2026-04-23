using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class PhoneService (AppDbContext context): IPhoneService
{
    public async Task<PhoneRatingResultDto?> AddOrUpdateRatingAsync(int phoneId, string userId, int rating)
    {
        var phoneExists = await context.Phones.AnyAsync(p => p.Id == phoneId);
        if (!phoneExists) return null;

        var phoneRating = await context.PhoneRatings
            .FirstOrDefaultAsync(r => r.PhoneId == phoneId && r.UserId == userId);

        if (phoneRating == null)
        {
            phoneRating = new PhoneRating
            {
                PhoneId = phoneId,
                UserId = userId,
                Rating = rating
            };

            context.PhoneRatings.Add(phoneRating);
        }
        else
        {
            phoneRating.Rating = rating;
        }

        await context.SaveChangesAsync();

        var ratings = context.PhoneRatings.Where(r => r.PhoneId == phoneId);

        return new PhoneRatingResultDto
        {
            AverageRating = await ratings.AverageAsync(r => (double)r.Rating),
            RatingsCount = await ratings.CountAsync(),
            UserRating = rating
        };
    }

    public async Task<PhoneDetailsDto?> GetPhoneByIdAsync(int id)
    {
        var phone = await context.Phones
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
                        IsMain = i.IsMain
                    })
                    .ToList(),
                RatingsCount = p.PhoneRatings.Count(),
                AverageRating = p.PhoneRatings.Average(r => (double?)r.Rating) ?? 0
            })
            .FirstOrDefaultAsync();

        return phone;

            
    }

    public async Task<IEnumerable<PhoneListItemDto>> GetPhonesAsync()
    {
        var phones = await context.Phones
            .Select(p => new PhoneListItemDto
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
                .FirstOrDefault() ?? string.Empty,
                RatingsCount = p.PhoneRatings
                .Count(),
                AverageRating = p.PhoneRatings
                .Average(r => (double?)r.Rating) ?? 0

            })
            .ToListAsync();

        return phones;
    }
}
