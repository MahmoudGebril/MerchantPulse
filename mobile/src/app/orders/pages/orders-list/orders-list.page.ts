import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../services/api.service';
import type { Order } from '../../../models';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSpinner,
    IonIcon,
  ],
  templateUrl: './orders-list.page.html',
  styleUrl: './orders-list.page.scss',
})
export class OrdersListPage {
  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _orders = signal<Order[]>([]);
  private readonly _loading = signal(true);
  private readonly _error = signal<string | null>(null);

  readonly orders = this._orders.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  ngOnInit(): void {
    this.api.getOrders().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this._orders.set(res.data);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err?.error?.error ?? 'Failed to load orders');
        this._loading.set(false);
      },
    });
  }

  statusColor(status: string): string {
    const map: Record<string, string> = {
      PAID: 'success',
      SHIPPED: 'primary',
      PENDING: 'warning',
      CANCELLED: 'danger',
      ABANDONED: 'medium',
    };
    return map[status] ?? 'medium';
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString();
  }
}
