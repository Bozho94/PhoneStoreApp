import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from "../layout/nav-bar/nav-bar";
import { AuthService } from '../core/services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private authService = inject(AuthService);

  ngOnInit(): void {
    if (!this.authService.currentUser) return;

    this.authService.getCurrentUser().subscribe({
      error: () => {
        this.authService.logout();
      },
    });
  }
}
