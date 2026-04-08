using API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<AppUser>(options)
{
    public DbSet<Phone> Phones { get; set; }

    public DbSet<PhoneImage> PhoneImages { get; set; }

    public DbSet<PhoneRating> PhoneRatings { get; set; }

    public DbSet<Order> Orders { get; set; }

    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
       base.OnModelCreating(modelBuilder);

       modelBuilder.Entity<Phone>()
       .HasQueryFilter(x => !x.IsDeleted);

       modelBuilder.Entity<PhoneImage>()
       .HasQueryFilter(x => !x.IsDeleted);

       modelBuilder.Entity<Order>()
       .Property(x => x.Status)
       .HasConversion<string>();

       modelBuilder.Entity<Order>()
       .Property(x => x.DeliveryMethod)
       .HasConversion<string>();
    }
}
