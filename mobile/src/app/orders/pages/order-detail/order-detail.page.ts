import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonSpinner,
} from '@ionic/angular/standalone';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../../services/api.service';
import type { Order } from '../../../models';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonSpinner,
  ],
  templateUrl: './order-detail.page.html',
  styleUrl: './order-detail.page.scss',
})
export class OrderDetailPage {
  statusColor = (s: string) => {
    const map: Record<string, string> = { PAID: 'success', SHIPPED: 'primary', PENDING: 'warning', CANCELLED: 'danger', ABANDONED: 'medium' };
    return map[s] ?? 'medium';
  };
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _order = signal<Order | null>(null);
  readonly order = this._order.asReadonly();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getOrder(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res: { data: Order }) => this._order.set(res.data),
        error: () => this.router.navigate(['/orders']),
      });
    }
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleString();
  }
}
