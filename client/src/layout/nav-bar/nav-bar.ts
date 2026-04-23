import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { LoginType } from '../../types/LoginType';

@Component({
  selector: 'app-nav-bar',
  imports: [FormsModule, RouterLink],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  authService = inject(AuthService);

  loginData: LoginType = {
    email: '',
    password: '',
  };

  errorMessage = '';

  login(): void {
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.loginData.password = '';
      },
      error: () => {
        this.errorMessage = 'Invalid email or password';
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
