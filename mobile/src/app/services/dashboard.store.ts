import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';
import type { DashboardAnalytics } from '../models';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly api = inject(ApiService);

  private readonly _analytics = signal<DashboardAnalytics | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly analytics = this._analytics.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly totalRevenue = computed(() => this._analytics()?.totalRevenue ?? 0);
  readonly ordersToday = computed(() => this._analytics()?.ordersToday ?? 0);
  readonly conversionRate = computed(() => this._analytics()?.conversionRate ?? 0);
  readonly abandonedCartPercent = computed(() => this._analytics()?.abandonedCartPercent ?? 0);
  readonly revenueTrend = computed(() => this._analytics()?.revenueTrend ?? []);
  readonly ordersPerDay = computed(() => this._analytics()?.ordersPerDay ?? []);
  readonly topProducts = computed(() => this._analytics()?.topProducts ?? []);

  loadAnalytics(): void {
    this._loading.set(true);
    this._error.set(null);
    this.api.getDashboardAnalytics().subscribe({
      next: (res) => {
        this._analytics.set(res.data);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err?.error?.error ?? 'Failed to load analytics');
        this._loading.set(false);
      },
    });
  }
}
