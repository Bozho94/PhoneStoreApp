import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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
    localStorage.removeItem('user');
    this.currentUser = null;
  }

  isAdmin(): boolean {
    return this.currentUser?.roles?.includes('Admin') === true;
  }

  private setCurrentUser(user: UserType): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser = user;
  }

  private getUserFromLocalStorage(): UserType | null {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as UserType;
    } catch {
      return null;
    }
  }
}
