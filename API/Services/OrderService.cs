using API.Data;
using API.DTOs;
using API.Entities;
using API.Enums;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class OrderService(AppDbContext context) : IOrderService
{
    public async Task<OrderDetailsDto?> CreateOrderAsync(string userId, CreateOrderRequestDto orderDto)
    {
        if (orderDto.Items.Count == 0) return null;

        if (!TryParseDeliveryMethod(orderDto.DeliveryMethod, out var deliveryMethod)) return null;

        var phonesById = await GetPhonesByIdAsync(orderDto.Items);
        var order = CreateOrder(userId, orderDto, deliveryMethod);

        if (!TryAddOrderItems(order, orderDto.Items, phonesById)) return null;

        context.Orders.Add(order);
        await context.SaveChangesAsync();

        return await GetOrderByIdAsync(order.Id);
    }

    public Task<OrderDetailsDto?> ApproveOrderAsync(int orderId)
    {
        return UpdateOrderStatusAsync(orderId, OrderStatus.Approved);
    }

    public Task<OrderDetailsDto?> CancelOrderAsync(int orderId)
    {
        return UpdateOrderStatusAsync(orderId, OrderStatus.Canceled);
    }

    public async Task<List<OrderDetailsDto>> GetAllOrdersAsync()
    {
        var orders = await OrdersWithDetails()
            .OrderByDescending(order => order.CreatedAt)
            .ToListAsync();

        return orders.Select(MapOrder).ToList();
    }

    private async Task<OrderDetailsDto?> GetOrderByIdAsync(int orderId)
    {
        var order = await OrdersWithDetails()
            .FirstOrDefaultAsync(o => o.Id == orderId);

        return order == null ? null : MapOrder(order);
    }

    private static bool TryParseDeliveryMethod(string deliveryMethod, out DeliveryMethod parsedDeliveryMethod)
    {
        return Enum.TryParse(deliveryMethod, true, out parsedDeliveryMethod);
    }

    private async Task<Dictionary<int, Phone>> GetPhonesByIdAsync(IEnumerable<CreateOrderItemRequestDto> items)
    {
        var phoneIds = items
            .Select(item => item.PhoneId)
            .Distinct()
            .ToList();

        return await context.Phones
            .Where(phone => phoneIds.Contains(phone.Id))
            .ToDictionaryAsync(phone => phone.Id);
    }

    private static Order CreateOrder(string userId, CreateOrderRequestDto orderDto, DeliveryMethod deliveryMethod)
    {
        return new Order
        {
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            Status = OrderStatus.Pending,
            DeliveryMethod = deliveryMethod,
            DeliveryAddress = orderDto.DeliveryAddress,
            CourierOffice = orderDto.CourierOffice,
            RecipientName = orderDto.RecipientName,
            RecipientPhone = orderDto.RecipientPhone
        };
    }

    private static bool TryAddOrderItems(
        Order order,
        IEnumerable<CreateOrderItemRequestDto> items,
        IReadOnlyDictionary<int, Phone> phonesById)
    {
        foreach (var item in items)
        {
            if (!phonesById.TryGetValue(item.PhoneId, out var phone) || phone.StockQuantity < item.Quantity)
            {
                return false;
            }

            phone.StockQuantity -= item.Quantity;
            order.Items.Add(CreateOrderItem(phone, item.Quantity));
            order.TotalPrice += phone.Price * item.Quantity;
        }

        return true;
    }

    private static OrderItem CreateOrderItem(Phone phone, int quantity)
    {
        return new OrderItem
        {
            PhoneId = phone.Id,
            Quantity = quantity,
            UnitPrice = phone.Price
        };
    }

    private async Task<OrderDetailsDto?> UpdateOrderStatusAsync(int orderId, OrderStatus newStatus)
    {
        var order = await context.Orders.FirstOrDefaultAsync(o => o.Id == orderId);
        if (order == null) return null;

        order.Status = newStatus;
        await context.SaveChangesAsync();

        return await GetOrderByIdAsync(order.Id);
    }

    private IQueryable<Order> OrdersWithDetails()
    {
        return context.Orders
            .AsNoTracking()
            .Include(o => o.User)
            .Include(o => o.Items)
            .ThenInclude(i => i.Phone)
            .ThenInclude(p => p.Images);
    }

    private static OrderDetailsDto MapOrder(Order order)
    {
        return new OrderDetailsDto
        {
            Id = order.Id,
            UserId = order.UserId,
            CustomerName = order.User.FullName,
            CreatedAt = order.CreatedAt,
            Status = order.Status.ToString(),
            TotalPrice = order.TotalPrice,
            DeliveryMethod = order.DeliveryMethod.ToString(),
            DeliveryAddress = order.DeliveryAddress,
            CourierOffice = order.CourierOffice,
            RecipientName = order.RecipientName,
            RecipientPhone = order.RecipientPhone,
            Items = order.Items.Select(item => new OrderItemDetailsDto
            {
                PhoneId = item.PhoneId,
                Brand = item.Phone.Brand,
                Model = item.Phone.Model,
                ImageUrl = GetMainImageUrl(item.Phone),
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice
            }).ToList()
        };
    }

    private static string GetMainImageUrl(Phone phone)
    {
        return phone.Images.FirstOrDefault(image => image.IsMain)?.ImageUrl ?? string.Empty;
    }
}
