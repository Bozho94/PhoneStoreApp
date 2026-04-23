import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { RegisterType } from '../../../types/RegisterType';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  registerData: RegisterType = {
    fullName: '',
    email: '',
    password: '',
  };

  errorMessage = '';

  register(): void {
    this.errorMessage = '';

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.router.navigateByUrl('/phones');
      },
      error: () => {
        this.errorMessage = 'Registration failed';
      },
    });
  }
}
