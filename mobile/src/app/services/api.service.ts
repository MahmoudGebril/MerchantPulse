import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type {
  Store,
  Product,
  Customer,
  Order,
  DashboardAnalytics,
} from '../models';

const API = '/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  getStore() {
    return this.http.get<{ success: boolean; data: Store }>(`${API}/store/me`).pipe(
      (o) => o as Observable<{ success: boolean; data: Store }>
    );
  }

  getProducts() {
    return this.http.get<{ success: boolean; data: Product[] }>(`${API}/products`).pipe(
      (o) => o as Observable<{ success: boolean; data: Product[] }>
    );
  }

  getProduct(id: string) {
    return this.http.get<{ success: boolean; data: Product }>(`${API}/products/${id}`).pipe(
      (o) => o as Observable<{ success: boolean; data: Product }>
    );
  }

  createProduct(data: Partial<Product>) {
    return this.http.post<{ success: boolean; data: Product }>(`${API}/products`, data).pipe(
      (o) => o as Observable<{ success: boolean; data: Product }>
    );
  }

  updateProduct(id: string, data: Partial<Product>) {
    return this.http.patch<{ success: boolean; data: Product }>(`${API}/products/${id}`, data).pipe(
      (o) => o as Observable<{ success: boolean; data: Product }>
    );
  }

  deleteProduct(id: string) {
    return this.http.delete<{ success: boolean }>(`${API}/products/${id}`).pipe(
      (o) => o as Observable<{ success: boolean }>
    );
  }

  getCustomers() {
    return this.http.get<{ success: boolean; data: Customer[] }>(`${API}/customers`).pipe(
      (o) => o as Observable<{ success: boolean; data: Customer[] }>
    );
  }

  getOrders(status?: string) {
    const url = status ? `${API}/orders?status=${status}` : `${API}/orders`;
    return this.http.get<{ success: boolean; data: Order[] }>(url).pipe(
      (o) => o as Observable<{ success: boolean; data: Order[] }>
    );
  }

  getOrder(id: string) {
    return this.http.get<{ success: boolean; data: Order }>(`${API}/orders/${id}`).pipe(
      (o) => o as Observable<{ success: boolean; data: Order }>
    );
  }

  createOrder(data: {
    customerId: string;
    status: string;
    subtotal: number;
    discountAmount?: number;
    totalAmount: number;
    items: { productId: string; quantity: number; priceAtPurchase: number }[];
  }) {
    return this.http.post<{ success: boolean; data: Order }>(`${API}/orders`, data).pipe(
      (o) => o as Observable<{ success: boolean; data: Order }>
    );
  }

  updateOrder(id: string, data: { status?: string }) {
    return this.http.patch<{ success: boolean; data: Order }>(`${API}/orders/${id}`, data).pipe(
      (o) => o as Observable<{ success: boolean; data: Order }>
    );
  }

  deleteOrder(id: string) {
    return this.http.delete<{ success: boolean }>(`${API}/orders/${id}`).pipe(
      (o) => o as Observable<{ success: boolean }>
    );
  }

  getDashboardAnalytics() {
    return this.http
      .get<{ success: boolean; data: DashboardAnalytics }>(`${API}/analytics/dashboard`)
      .pipe((o) => o as Observable<{ success: boolean; data: DashboardAnalytics }>);
  }
}
