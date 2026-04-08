using API.Entities;
using API.SeedData;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;


namespace API.Data;

public class DbInitializer
{
    public static async Task SeedAsync(
        AppDbContext context,
        UserManager<AppUser> userManager,
        RoleManager<IdentityRole> roleManager
    )
    {
        if (!await roleManager.RoleExistsAsync("Admin"))
        {
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        }


        if (!await roleManager.RoleExistsAsync("Customer"))
        {
            await roleManager.CreateAsync(new IdentityRole("Customer"));
        }

        if (await userManager.FindByEmailAsync("admin@phonestore.com") == null)
        {
            var adminUser = new AppUser
            {
                UserName = "admin",
                Email = "admin@phonestore.com",
                FullName = "Store Admin"
            };
            await userManager.CreateAsync(adminUser, "Admin123!");
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }

        if (await context.Phones.AnyAsync()) return;

        var phonesData = await File.ReadAllTextAsync("SeedData/phones.seed.json");

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        var phones = JsonSerializer.Deserialize<List<PhoneSeedModel>>(phonesData, options);

        if (phones == null)
        {
            Console.WriteLine("Failed to deserialize phones data.");
            return;
        }

        foreach (var phone in phones)
        {
            var phoneEntity = new Phone
            {
                Brand = phone.Brand,
                Model = phone.Model,
                ReleaseYear = phone.ReleaseYear,
                CreatedAt = DateTime.UtcNow,
                Price = phone.Price,
                Description = phone.Description,
                StockQuantity = phone.StockQuantity,
                IsDeleted = false,
                Images = phone.Images.Select(img => new PhoneImage
                {
                    ImageUrl = img.ImageUrl,
                    IsMain = img.IsMain,
                    IsDeleted = false
                }).ToList()
            };

            context.Phones.Add(phoneEntity);
        }

        await context.SaveChangesAsync();
       
    }

}
