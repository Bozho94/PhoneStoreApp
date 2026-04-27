import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { OrderService } from '../../../core/services/order-service';
import { ToastService } from '../../../core/services/toast-service';
import { OrderType } from '../../../types/OrderType';

@Component({
  selector: 'app-admin-orders',
  imports: [DatePipe],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrders implements OnInit {
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);

  orders: OrderType[] = [];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (orders) => (this.orders = orders),
      error: () => this.toastService.error('Could not load orders.'),
    });
  }

  approveOrder(order: OrderType): void {
    this.orderService.approveOrder(order.id).subscribe({
      next: (updatedOrder) => {
        this.replaceOrder(updatedOrder);
        this.toastService.success('Order approved.');
      },
      error: () => this.toastService.error('Could not approve order.'),
    });
  }

  cancelOrder(order: OrderType): void {
    this.orderService.cancelOrder(order.id).subscribe({
      next: (updatedOrder) => {
        this.replaceOrder(updatedOrder);
        this.toastService.success('Order canceled.');
      },
      error: () => this.toastService.error('Could not cancel order.'),
    });
  }

  getDeliveryMethodText(order: OrderType): string {
    if (order.deliveryMethod === 'HomeAddress') {
      return 'Home address';
    }

    return 'Courier office';
  }

  getDeliveryDetails(order: OrderType): string {
    if (order.deliveryMethod === 'HomeAddress') {
      return order.deliveryAddress || '-';
    }

    return order.courierOffice || '-';
  }

  private replaceOrder(updatedOrder: OrderType): void {
    this.orders = this.orders.map((order) => {
      if (order.id === updatedOrder.id) {
        return updatedOrder;
      }

      return order;
    });
  }
}
