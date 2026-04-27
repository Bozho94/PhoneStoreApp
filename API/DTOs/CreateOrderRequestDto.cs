using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class CreateOrderRequestDto
{
    [Required]
    [MaxLength(100)]
    public string RecipientName { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string RecipientPhone { get; set; } = string.Empty;

    [Required]
    public string DeliveryMethod { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? DeliveryAddress { get; set; }

    [MaxLength(200)]
    public string? CourierOffice { get; set; }

    public List<CreateOrderItemRequestDto> Items { get; set; } = [];
}
