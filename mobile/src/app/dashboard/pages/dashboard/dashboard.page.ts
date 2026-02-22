import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  effect,
  ViewChild,
  ElementRef,
  afterNextRender,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonNote,
} from '@ionic/angular/standalone';
import { RefresherCustomEvent } from '@ionic/angular';
import { RevenueChartComponent } from '../../components/revenue-chart.component';
import { OrdersChartComponent } from '../../components/orders-chart.component';
import { TopProductsChartComponent } from '../../components/top-products-chart.component';
import { DashboardStore } from '../../../services/dashboard.store';
import { ThemeService } from '../../../theme/services/theme.service';
import { AuthService } from '../../../auth/services/auth.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonNote,
    RevenueChartComponent,
    OrdersChartComponent,
    TopProductsChartComponent,
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage implements OnInit {
  private readonly dashboardStore = inject(DashboardStore);
  private readonly theme = inject(ThemeService);
  private readonly auth = inject(AuthService);

  @ViewChild('kpiCards') kpiCardsRef?: ElementRef<HTMLElement>;

  readonly storeName = this.theme.storeName;
  readonly loading = this.dashboardStore.loading;
  readonly error = this.dashboardStore.error;
  readonly totalRevenue = this.dashboardStore.totalRevenue;
  readonly ordersToday = this.dashboardStore.ordersToday;
  readonly conversionRate = this.dashboardStore.conversionRate;
  readonly abandonedCartPercent = this.dashboardStore.abandonedCartPercent;
  readonly revenueTrend = this.dashboardStore.revenueTrend;
  readonly ordersPerDay = this.dashboardStore.ordersPerDay;
  readonly topProducts = this.dashboardStore.topProducts;

  readonly currency = computed(() => {
    const u = this.auth.currentUser();
    return u?.store?.currency ?? 'USD';
  });

  readonly revenueFormatted = computed(() => {
    const r = this.totalRevenue();
    const c = this.currency();
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: c,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(r);
  });

  constructor() {
    afterNextRender(() => {
      this.animateEntrance();
    });
  }

  ngOnInit(): void {
    this.dashboardStore.loadAnalytics();
  }

  refresh(event: Event): void {
    this.dashboardStore.loadAnalytics();
    (event as RefresherCustomEvent).detail.complete();
  }

  private animateEntrance(): void {
    const el = this.kpiCardsRef?.nativeElement;
    if (!el) return;
    const cards = el.querySelectorAll('.kpi-card');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
    );
  }
}
