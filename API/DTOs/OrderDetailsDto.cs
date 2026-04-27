namespace API.DTOs;

public class OrderDetailsDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal TotalPrice { get; set; }
    public string DeliveryMethod { get; set; } = string.Empty;
    public string? DeliveryAddress { get; set; }
    public string? CourierOffice { get; set; }
    public string RecipientPhone { get; set; } = string.Empty;
    public string RecipientName { get; set; } = string.Empty;
    public List<OrderItemDetailsDto> Items { get; set; } = [];
}
