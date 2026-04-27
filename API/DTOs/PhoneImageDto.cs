namespace API.DTOs;

public class PhoneImageDto
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? PublicId { get; set; }
    public bool IsMain { get; set; }
}
