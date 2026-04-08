using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace API.Entities;

[Index(nameof(PhoneId), nameof(UserId), IsUnique = true)]
public class PhoneRating
{
    public int Id { get; set; }

    public int PhoneId { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    [Range(1, 5)]
    public int Rating { get; set; } 

    public Phone Phone { get; set; } = null!;

    public AppUser User { get; set; } = null!;
}
