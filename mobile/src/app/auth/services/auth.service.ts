import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap, catchError, of } from 'rxjs';
import type { User, Store } from '../../models';

const API = '/api';

export interface LoginResponse {
  token: string;
  user: User & { store?: Store };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _token = signal<string | null>(this.loadToken());
  private readonly _user = signal<(User & { store?: Store }) | null>(this.loadUser());

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());
  readonly currentUser = computed(() => this._user());

  private loadToken(): string | null {
    return localStorage.getItem('merchantpulse_token');
  }

  private loadUser(): (User & { store?: Store }) | null {
    const raw = localStorage.getItem('merchantpulse_user');
    return raw ? JSON.parse(raw) : null;
  }

  login(email: string, password: string) {
    return this.http
      .post<{ success: boolean; data: LoginResponse }>(`${API}/auth/login`, { email, password })
      .pipe(
        map((r) => r.data),
        tap((data) => {
          localStorage.setItem('merchantpulse_token', data.token);
          localStorage.setItem('merchantpulse_user', JSON.stringify(data.user));
          this._token.set(data.token);
          this._user.set(data.user);
        })
      );
  }

  register(data: {
    name: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'SELLER' | 'VIEWER';
    storeId?: string;
  }) {
    return this.http
      .post<{ success: boolean; data: User }>(`${API}/auth/register`, data)
      .pipe(map((r) => r.data));
  }

  logout(): void {
    localStorage.removeItem('merchantpulse_token');
    localStorage.removeItem('merchantpulse_user');
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  refreshStore(store: Store): void {
    this._user.update((u) => (u ? { ...u, store } : null));
    const u = this._user();
    if (u) localStorage.setItem('merchantpulse_user', JSON.stringify(u));
  }
}
