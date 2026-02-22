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
  selector: 'app-top-products-chart',
  standalone: true,
  template: `<div class="chart-container"><canvas #canvas></canvas></div>`,
  styles: [`.chart-container { height: 220px; position: relative; }`],
})
export class TopProductsChartComponent implements OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  data = input<{ productName: string; quantitySold: number }[]>([]);

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

    const maxLen = 18;
    const labels = data.map((d) =>
      d.productName.length > maxLen ? d.productName.slice(0, maxLen) + '…' : d.productName
    );

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Sold',
            data: data.map((d) => d.quantitySold),
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--brand-primary') || '#4F46E5',
            barThickness: 16,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { beginAtZero: true },
        },
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.chart = null;
  }
}
