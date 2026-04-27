using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class CreateOrderItemRequestDto
{
    public int PhoneId { get; set; }

    [Range(1, 100)]
    public int Quantity { get; set; }
}
