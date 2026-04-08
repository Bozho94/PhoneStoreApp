namespace API.SeedData;

public class PhoneSeedModel
{
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;

    public int ReleaseYear { get; set; }

    public decimal Price { get; set; }

    public string Description { get; set; } = string.Empty;

    public int StockQuantity { get; set; }  

    public List<PhoneImageSeedModel> Images { get; set; } = [];

}
