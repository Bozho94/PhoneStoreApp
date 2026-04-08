using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace API.Entities;

public class Phone
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Brand { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Model { get; set; } = string.Empty;

    [Range(2000,2100)]
    public int ReleaseYear { get; set; }

    [Range(0.01, 100000)]
    [Precision(18, 2)]
    public decimal Price { get; set; }

    [Required]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;
    
    [Range(0, 10000)]
    public int StockQuantity { get; set; }

    public DateTime CreatedAt { get; set; }

    public bool IsDeleted { get; set; } 

    public List<PhoneImage> Images { get; set; } = [];
    public List<OrderItem> OrderItems { get; set; } = [];

    public List<PhoneRating> PhoneRatings { get; set; } = [];

}
