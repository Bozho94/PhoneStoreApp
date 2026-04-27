import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart-service';
import { OrderService } from '../../../core/services/order-service';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-cart-page',
  imports: [RouterLink, FormsModule],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage {
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);

  recipientName = '';
  recipientPhone = '';
  deliveryMethod = 'HomeAddress';
  deliveryAddress = '';
  courierOffice = '';

  removeItem(phoneId: number): void {
    this.cartService.removeFromCart(phoneId);
  }

  get totalPrice(): number {
    return this.cartService.totalPrice;
  }

  checkout(): void {
    const validationMessage = this.validateCheckout();
    if (validationMessage) {
      this.toastService.error(validationMessage);
      return;
    }

    const order = this.buildOrder();

    this.orderService.createOrder(order).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.resetCheckoutForm();
        this.toastService.success('Order completed.');
      },
      error: () => this.toastService.error('Could not complete order.'),
    });
  }

  private validateCheckout(): string | null {
    if (!this.cartService.hasItems) {
      return 'Your cart is empty.';
    }

    if (this.isBlank(this.recipientName) || this.isBlank(this.recipientPhone)) {
      return 'Please enter recipient name and phone.';
    }

    if (this.deliveryMethod === 'HomeAddress' && this.isBlank(this.deliveryAddress)) {
      return 'Please enter delivery address.';
    }

    if (this.deliveryMethod === 'CourierOffice' && this.isBlank(this.courierOffice)) {
      return 'Please enter courier office.';
    }

    return null;
  }

  private buildOrder() {
    return {
      recipientName: this.recipientName.trim(),
      recipientPhone: this.recipientPhone.trim(),
      deliveryMethod: this.deliveryMethod,
      deliveryAddress: this.deliveryAddress.trim(),
      courierOffice: this.courierOffice.trim(),
      items: this.cartService.cartItems.map((item) => ({
        phoneId: item.phoneId,
        quantity: item.quantity,
      })),
    };
  }

  private resetCheckoutForm(): void {
    this.recipientName = '';
    this.recipientPhone = '';
    this.deliveryMethod = 'HomeAddress';
    this.deliveryAddress = '';
    this.courierOffice = '';
  }

  private isBlank(value: string): boolean {
    return value.trim() === '';
  }
}
