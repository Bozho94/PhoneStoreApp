import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { LoginType } from '../../types/LoginType';
import { CartService } from '../../core/services/cart-service';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-nav-bar',
  imports: [FormsModule, RouterLink],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  authService = inject(AuthService);
  cartService = inject(CartService);
  private toastService = inject(ToastService);

  loginData: LoginType = {
    email: '',
    password: '',
  };

  login(): void {
    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.loginData.password = '';
        this.toastService.success('Login successful.');
      },
      error: () => {
        this.loginData.password = '';
        this.toastService.error('Invalid email or password.');
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.toastService.success('Logout successful.');
  }

  hasCartItems(): boolean {
    return this.cartService.cartItems.length > 0;
  }
}
