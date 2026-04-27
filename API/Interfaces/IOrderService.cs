using API.DTOs;

namespace API.Interfaces;

public interface IOrderService
{
    Task<OrderDetailsDto?> CreateOrderAsync(string userId, CreateOrderRequestDto orderDto);
    Task<List<OrderDetailsDto>> GetAllOrdersAsync();
    Task<OrderDetailsDto?> ApproveOrderAsync(int orderId);
    Task<OrderDetailsDto?> CancelOrderAsync(int orderId);
}
