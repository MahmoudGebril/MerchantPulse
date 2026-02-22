import { Component, inject, signal, computed } from '@angular/core';
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
  IonSpinner,
} from '@ionic/angular/standalone';
import { ApiService } from '../../../services/api.service';
import type { Product } from '../../../models';

@Component({
  selector: 'app-products-list',
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
    IonSpinner,
    IonNote,
  ],
  templateUrl: './products-list.page.html',
  styleUrl: './products-list.page.scss',
})
export class ProductsListPage {
  private readonly api = inject(ApiService);

  private readonly _products = signal<Product[]>([]);
  private readonly _loading = signal(true);
  private readonly _error = signal<string | null>(null);

  readonly products = this._products.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  ngOnInit(): void {
    this.api.getProducts().subscribe({
      next: (res) => {
        this._products.set(res.data);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err?.error?.error ?? 'Failed to load products');
        this._loading.set(false);
      },
    });
  }
}
