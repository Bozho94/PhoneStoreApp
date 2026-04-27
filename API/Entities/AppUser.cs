using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class AppUser : IdentityUser
{
   [Required]
   [MaxLength(100)]
   public string FullName { get; set; } = string.Empty;

   public List<Order> Orders { get; set; } = [];
}
