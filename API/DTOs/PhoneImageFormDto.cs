using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class PhoneImageFormDto
{
    [Required]
    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? PublicId { get; set; }

    public bool IsMain { get; set; }
}
