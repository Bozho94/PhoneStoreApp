import { inject, Injectable } from '@angular/core';
import { CartItemType } from '../../types/CartItemType';
import { PhoneDetailsType } from '../../types/PhoneDetailsType';
import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private toastService = inject(ToastService);
  cartItems: CartItemType[] = [];

  constructor() {
    this.loadCart();
  }

  get hasItems(): boolean {
    return this.cartItems.length > 0;
  }

  get totalPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  addToCart(phone: PhoneDetailsType): void {
    const existingItem = this.findCartItem(phone.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push(this.createCartItem(phone));
    }

    this.persistCart();
    this.toastService.success('Item added to cart.');
  }

  removeFromCart(phoneId: number): void {
    this.cartItems = this.cartItems.filter((item) => item.phoneId !== phoneId);

    this.persistCart();
    this.toastService.success('Item removed from cart.');
  }

  clearCart(): void {
    this.cartItems = [];
    this.persistCart();
  }

  private loadCart(): void {
    const cart = localStorage.getItem('cart');

    if (cart) {
      this.cartItems = JSON.parse(cart);
    }
  }

  private findCartItem(phoneId: number): CartItemType | undefined {
    return this.cartItems.find((item) => item.phoneId === phoneId);
  }

  private createCartItem(phone: PhoneDetailsType): CartItemType {
    const mainImage = phone.images.find((image) => image.isMain);

    return {
      phoneId: phone.id,
      brand: phone.brand,
      model: phone.model,
      price: phone.price,
      imageUrl: mainImage?.imageUrl ?? phone.images[0]?.imageUrl ?? '',
      quantity: 1,
    };
  }

  private persistCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }
}
