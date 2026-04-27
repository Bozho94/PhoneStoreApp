using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class PhoneFormDto
{
    [Required]
    [MaxLength(50)]
    public string Brand { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Model { get; set; } = string.Empty;

    [Range(2000, 2100)]
    public int ReleaseYear { get; set; }

    [Range(0.01, 100000)]
    public decimal Price { get; set; }

    [Required]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Range(0, 10000)]
    public int StockQuantity { get; set; }

    public List<PhoneImageFormDto> Images { get; set; } = [];
}
