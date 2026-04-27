namespace API.DTOs;

public class PhoneListDto
{
    public int Id { get; set; }

    public string Brand { get; set; } = string.Empty;

    public string Model { get; set; } = string.Empty;

    public int ReleaseYear { get; set; }

    public decimal Price { get; set; }

    public int StockQuantity { get; set; }

    public string MainImageUrl { get; set; } = string.Empty;
}
