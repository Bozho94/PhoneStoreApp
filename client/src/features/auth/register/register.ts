import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { RegisterType } from '../../../types/RegisterType';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  registerData: RegisterType = {
    fullName: '',
    email: '',
    password: '',
  };

  register(): void {
    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.toastService.success('Registration successful.');
        this.router.navigateByUrl('/phones');
      },
      error: () => {
        this.toastService.error('Registration failed.');
      },
    });
  }
}
