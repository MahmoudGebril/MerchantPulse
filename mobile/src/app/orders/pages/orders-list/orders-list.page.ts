import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonNote,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSpinner,
} from '@ionic/angular/standalone';
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
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonSpinner,
    IonNote,
  ],
  templateUrl: './orders-list.page.html',
  styleUrl: './orders-list.page.scss',
})
export class OrdersListPage {
  private readonly api = inject(ApiService);

  private readonly _orders = signal<Order[]>([]);
  private readonly _loading = signal(true);
  private readonly _error = signal<string | null>(null);

  readonly orders = this._orders.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  ngOnInit(): void {
    this.api.getOrders().subscribe({
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
