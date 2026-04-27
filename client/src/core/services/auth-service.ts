import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginType } from '../../types/LoginType';
import { RegisterType } from '../../types/RegisterType';
import { UserType } from '../../types/UserType';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = environment.apiUrl + 'account/';

  currentUser: UserType | null = this.getUserFromLocalStorage();

  login(loginData: LoginType) {
    return this.http.post<UserType>(this.baseUrl + 'login', loginData).pipe(
      tap((user) => {
        this.setCurrentUser(user);
      })
    );
  }

  register(registerData: RegisterType) {
    return this.http.post<UserType>(this.baseUrl + 'register', registerData).pipe(
      tap((user) => {
        this.setCurrentUser(user);
      })
    );
  }

  getCurrentUser() {
    return this.http.get<UserType>(this.baseUrl + 'current-user').pipe(
      tap((user) => {
        this.setCurrentUser(user);
      })
    );
  }

  logout(): void {
    this.clearCurrentUser();

    if (this.router.url.startsWith('/admin')) {
      this.router.navigate(['/not-found']);
    }
  }

  isAdmin(): boolean {
    return this.currentUser?.roles?.includes('Admin') === true;
  }

  hasToken(): boolean {
    return this.getStoredToken() !== null;
  }

  clearCurrentUser(): void {
    localStorage.removeItem('user');
    this.currentUser = null;
  }

  private setCurrentUser(user: UserType): void {
    const normalizedUser = this.normalizeUser(user);

    localStorage.setItem('user', JSON.stringify(normalizedUser));
    this.currentUser = normalizedUser;
  }

  private getUserFromLocalStorage(): UserType | null {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;

    try {
      return this.normalizeUser(JSON.parse(userJson) as UserType);
    } catch {
      return null;
    }
  }

  private normalizeUser(user: UserType): UserType {
    return {
      ...user,
      roles: this.getRolesFromToken(user.token),
    };
  }

  private getStoredToken(): string | null {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;

    try {
      const user = JSON.parse(userJson) as { token?: string };
      return user.token ?? null;
    } catch {
      return null;
    }
  }

  private getRolesFromToken(token: string): string[] {
    if (!token) return [];

    const payload = this.parseJwtPayload(token);
    if (!payload) return [];

    const roleClaim =
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      payload['role'];

    if (Array.isArray(roleClaim)) {
      return roleClaim.filter((role): role is string => typeof role === 'string');
    }

    if (typeof roleClaim === 'string') {
      return [roleClaim];
    }

    return [];
  }

  private parseJwtPayload(token: string): Record<string, unknown> | null {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    try {
      const normalizedPayload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const paddedPayload = normalizedPayload.padEnd(
        normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
        '='
      );

      return JSON.parse(atob(paddedPayload)) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}
