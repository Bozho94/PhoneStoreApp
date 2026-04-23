import { Injectable } from '@angular/core';
import { CartItemType } from '../../types/CartItemType';
import { PhoneDetailsType } from '../../types/PhoneDetailsType';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItemType[] = [];

  constructor() {
    this.loadCart();
  }

  addToCart(phone: PhoneDetailsType): void {
    const existingItem = this.cartItems.find(
      item => item.phoneId === phone.id
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      const item: CartItemType = {
        phoneId: phone.id,
        brand: phone.brand,
        model: phone.model,
        price: phone.price,
        imageUrl: phone.images[0]?.imageUrl ?? '',
        quantity: 1,
      };

      this.cartItems.push(item);
    }

    this.saveCart();
  }

  removeFromCart(phoneId: number): void {
    this.cartItems = this.cartItems.filter(
      item => item.phoneId !== phoneId
    );

    this.saveCart();
  }

  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  loadCart(): void {
    const cart = localStorage.getItem('cart');

    if (cart) {
      this.cartItems = JSON.parse(cart);
    }
  }
}
