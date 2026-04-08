using System.ComponentModel.DataAnnotations;
using API.Enums;
using Microsoft.EntityFrameworkCore;


namespace API.Entities;

public class Order
{
    public int Id { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public OrderStatus Status { get; set; }

    [Range(0.01, 100000)]
    [Precision(18, 2)]
    public decimal TotalPrice { get; set; }

    public DeliveryMethod DeliveryMethod { get; set; }

    [MaxLength(300)]
    public string? DeliveryAddress { get; set; }

    [MaxLength(200)]
    public string? CourierOffice { get; set; }

    [Required]
    [MaxLength(30)]
    public string RecipientPhone { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string RecipientName { get; set; } = string.Empty;

    public AppUser User { get; set; } = null!;

    public List<OrderItem> Items { get; set; } = [];

}
