namespace API.DTOs;

public class PhoneDetailsDto
{
    public int Id { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int ReleaseYear { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
    public List<PhoneImageDto> Images { get; set; } = [];
    public int RatingsCount { get; set; }
    public double AverageRating { get; set; }






}
