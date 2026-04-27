using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class OrdersController(IOrderService orderService) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<OrderDetailsDto>> CreateOrder(CreateOrderRequestDto orderDto)
    {
        var userId = CurrentUserId;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var order = await orderService.CreateOrderAsync(userId, orderDto);
        if (order == null) return BadRequest("Order could not be created.");

        return Ok(order);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public async Task<ActionResult<List<OrderDetailsDto>>> GetAllOrders()
    {
        var orders = await orderService.GetAllOrdersAsync();
        return Ok(orders);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/approve")]
    public async Task<ActionResult<OrderDetailsDto>> ApproveOrder(int id)
    {
        var order = await orderService.ApproveOrderAsync(id);
        if (order == null) return NotFound();

        return Ok(order);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/cancel")]
    public async Task<ActionResult<OrderDetailsDto>> CancelOrder(int id)
    {
        var order = await orderService.CancelOrderAsync(id);
        if (order == null) return NotFound();

        return Ok(order);
    }
}
