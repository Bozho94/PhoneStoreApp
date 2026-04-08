using System.ComponentModel.DataAnnotations;

namespace API.Entities;

public class PhoneImage
{
    public int Id { get; set; }

    public int PhoneId { get; set; }

    [Required]
    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? PublicId { get; set; }

    public bool IsMain { get; set; }

    public bool IsDeleted { get; set; }

    public Phone Phone { get; set; } = null!;

}
