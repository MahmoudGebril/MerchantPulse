import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonBackButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { ApiService } from '../../../services/api.service';
import type { Product } from '../../../models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
  ],
  templateUrl: './product-detail.page.html',
  styleUrl: './product-detail.page.scss',
})
export class ProductDetailPage {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly _product = signal<Product | null>(null);
  readonly product = this._product.asReadonly();

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getProduct(id).subscribe({
        next: (res) => this._product.set(res.data),
        error: () => this.router.navigate(['/products']),
      });
    }
  }
}
