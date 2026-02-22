import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { guestGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/pages/login/login.page').then((m) => m.LoginPage),
    canActivate: [guestGuard],
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/tabs-layout/tabs-layout.page').then((m) => m.TabsLayoutPage),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/pages/dashboard/dashboard.page').then(
            (m) => m.DashboardPage
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./products/pages/products-list/products-list.page').then(
            (m) => m.ProductsListPage
          ),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./products/pages/product-detail/product-detail.page').then(
            (m) => m.ProductDetailPage
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./orders/pages/orders-list/orders-list.page').then(
            (m) => m.OrdersListPage
          ),
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./orders/pages/order-detail/order-detail.page').then(
            (m) => m.OrderDetailPage
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/pages/settings/settings.page').then(
            (m) => m.SettingsPage
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
