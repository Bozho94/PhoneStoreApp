import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PhoneService } from '../../../core/services/phone-service';
import { PhoneDetailsType } from '../../../types/PhoneDetailsType';
import { CartService } from '../../../core/services/cart-service';
import { ToastService } from '../../../core/services/toast-service';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-phone-details',
  imports: [RouterLink],
  templateUrl: './phone-details.html',
  styleUrl: './phone-details.css',
})
export class PhoneDetails implements OnInit {
  private phoneService = inject(PhoneService);
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  phone?: PhoneDetailsType;
  selectedImageUrl = '';

  get isLoggedIn(): boolean {
    return this.authService.currentUser !== null;
  }

  ngOnInit(): void {
    this.loadPhone();
  }

  selectImage(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
  }

  addToCart(): void {
    if (!this.phone) return;

    this.cartService.addToCart(this.phone);
  }

  private loadPhone(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.phoneService.getPhone(id).subscribe({
      next: (phone) => this.setPhone(phone),
      error: () => this.toastService.error('Could not load phone.'),
    });
  }

  private setPhone(phone: PhoneDetailsType): void {
    this.phone = phone;
    this.selectedImageUrl = this.getSelectedImageUrl(phone);
  }

  private getSelectedImageUrl(phone: PhoneDetailsType): string {
    const mainImage = phone.images.find((image) => image.isMain);
    return mainImage?.imageUrl ?? phone.images[0]?.imageUrl ?? '';
  }
}
