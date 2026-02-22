import {
  Component,
  DestroyRef,
  input,
  effect,
  inject,
  OnDestroy,
  ViewChild,
  ElementRef,
  afterNextRender,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  template: `<div class="chart-container"><canvas #canvas></canvas></div>`,
  styles: [`.chart-container { height: 200px; position: relative; }`],
})
export class RevenueChartComponent implements OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  data = input<{ date: string; revenue: number }[]>([]);

  private chart: Chart | null = null;
  private destroyed = false;
  private initTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      if (this.initTimeout) clearTimeout(this.initTimeout);
      this.chart?.destroy();
    });
    afterNextRender(() => this.scheduleInit());
    effect(() => {
      this.data();
      this.scheduleInit();
    });
  }

  private scheduleInit(): void {
    if (this.initTimeout) clearTimeout(this.initTimeout);
    this.initTimeout = setTimeout(() => {
      this.initTimeout = null;
      if (!this.destroyed) this.initChart();
    }, 0);
  }

  private initChart(): void {
    const data = this.data();
    if (!data.length || !this.canvasRef?.nativeElement) return;

    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((d) => d.date.slice(5)),
        datasets: [
          {
            label: 'Revenue',
            data: data.map((d) => d.revenue),
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--brand-primary') || '#4F46E5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.chart = null;
  }
}
