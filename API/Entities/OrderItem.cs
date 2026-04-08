using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace API.Entities;

public class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public int PhoneId { get; set; }

    [Range(1, 100)]
    public int Quantity { get; set; } 

    [Range(0.01, 100000)]  
    [Precision(18, 2)]
    public decimal UnitPrice { get; set; }

    public Order Order { get; set; } = null!;

    public Phone Phone { get; set; } = null!;

}
