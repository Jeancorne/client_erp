import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LoginRequest } from '../models/auth/login.request';
import { AuthResponse } from '../models/auth/auth-response.model';
import { UserInfo } from '../models/auth/user-info.model';
import { MenuItem } from '../models/auth/menu-item.model';
import { AuthData } from '../models/auth/auth-data.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // Signals para el estado global del usuario
  private _isAuthenticated = signal<boolean>(!!this.getToken());
  private _user = signal<UserInfo | null>(this.getStoredUser());
  private _menus = signal<MenuItem[]>(this.getStoredMenus());

  // Exposición pública de los Signals
  isAuthenticated = computed(() => this._isAuthenticated());
  currentUser = computed(() => this._user());
  userMenus = computed(() => this._menus());

  constructor() {}

  async login(request: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/login`, request)
      );

      if (response.succeeded && response.data) {
        this.persistAuthData(response.data);
      }

      return response;
    } catch (error: any) {
      return {
        succeeded: false,
        message: error.error?.message || 'Error de autenticación',
        errors: error.error?.errors || [error.message],
        data: {} as AuthData
      };
    }
  }

  private persistAuthData(data: AuthData) {
    localStorage.setItem('erp_token', data.token);
    localStorage.setItem('erp_user', JSON.stringify(data.user));
    localStorage.setItem('erp_menus', JSON.stringify(data.menus));

    this._user.set(data.user);
    this._menus.set(data.menus);
    this._isAuthenticated.set(true);
  }

  logout() {
    localStorage.removeItem('erp_token');
    localStorage.removeItem('erp_user');
    localStorage.removeItem('erp_menus');
    
    this._user.set(null);
    this._menus.set([]);
    this._isAuthenticated.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem('erp_token');
  }

  private getStoredUser(): UserInfo | null {
    const user = localStorage.getItem('erp_user');
    return user ? JSON.parse(user) : null;
  }

  private getStoredMenus(): MenuItem[] {
    const menus = localStorage.getItem('erp_menus');
    return menus ? JSON.parse(menus) : [];
  }
}
