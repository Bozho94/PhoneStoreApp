import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PhoneService } from '../../../core/services/phone-service';
import { PhoneDetailsType } from '../../../types/PhoneDetailsType';
import { CartService } from '../../../core/services/cart-service';

@Component({
  selector: 'app-phone-details',
  imports: [RouterLink],
  templateUrl: './phone-details.html',
  styleUrl: './phone-details.css',
})
export class PhoneDetails implements OnInit {
  private phoneService = inject(PhoneService);
  private route = inject(ActivatedRoute);
  private cartService = inject(CartService)

  phone?: PhoneDetailsType;
  selectedImageUrl = '';
  stars = [1, 2, 3, 4, 5];

  get isLoggedIn(): boolean {
    return localStorage.getItem('user') !== null;
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.phoneService.getPhone(id).subscribe({
      next: (phone) => {
        this.phone = phone;

        const mainImage = phone.images.find((image) => image.isMain);
        this.selectedImageUrl = mainImage?.imageUrl ?? phone.images[0]?.imageUrl ?? '';
      },
    });
  }

  selectImage(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
  }

  ratePhone(rating: number): void {
    if (!this.phone || !this.isLoggedIn) return;

    this.phoneService.ratePhone(this.phone.id, rating).subscribe({
      next: (result) => {
        this.phone = {
          ...this.phone!,
          averageRating: result.averageRating,
          ratingsCount: result.ratingsCount,
        };
      },
    });
  }

  addToCart(): void {
    if(!this.phone) return

    this.cartService.addToCart(this.phone);
  }
}
